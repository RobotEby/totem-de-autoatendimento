"use server";

import { ConsumptionMethod } from "@prisma/client";
import { headers } from "next/headers";
import { z } from "zod";

import { getRestaurantBySlug } from "@/data/get-restaurant-by-slug";
import { cpfSchema, removeCpfPunctuation } from "@/helpers/cpf";
import { toCents } from "@/helpers/format-currency";
import { db } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

const createOrderSchema = z.object({
  customerName: z.string().trim().min(1),
  customerCpf: cpfSchema,
  products: z
    .array(z.object({ id: z.string(), quantity: z.number().int().min(1) }))
    .min(1),
  consumptionMethod: z.enum(ConsumptionMethod),
  slug: z.string(),
});

type CreateOrderInput = z.infer<typeof createOrderSchema>;

export const createOrder = async (rawInput: CreateOrderInput) => {
  const stripe = getStripe();
  const input = createOrderSchema.parse(rawInput);
  const restaurant = await getRestaurantBySlug(input.slug);
  if (!restaurant) {
    throw new Error("Restaurant not found");
  }
  const productsWithPrices = await db.product.findMany({
    where: {
      restaurantId: restaurant.id,
      id: {
        in: input.products.map((product) => product.id),
      },
    },
  });
  const orderProducts = input.products.map(({ id, quantity }) => {
    const product = productsWithPrices.find((p) => p.id === id);
    if (!product) {
      throw new Error("Product not found");
    }
    return { product, quantity };
  });
  const order = await db.order.create({
    data: {
      status: "PENDING",
      customerName: input.customerName,
      customerCpf: removeCpfPunctuation(input.customerCpf),
      orderProducts: {
        createMany: {
          data: orderProducts.map(({ product, quantity }) => ({
            productId: product.id,
            quantity,
            price: product.price,
          })),
        },
      },
      total: orderProducts.reduce(
        (acc, { product, quantity }) => acc + product.price * quantity,
        0,
      ),
      consumptionMethod: input.consumptionMethod,
      restaurantId: restaurant.id,
    },
  });

  const origin = (await headers()).get("origin") as string;
  const searchParams = new URLSearchParams();
  searchParams.set("consumptionMethod", input.consumptionMethod);
  searchParams.set("cpf", removeCpfPunctuation(input.customerCpf));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    success_url: `${origin}/${input.slug}/success?${searchParams.toString()}`,
    cancel_url: `${origin}/${input.slug}/orders?${searchParams.toString()}`,
    metadata: {
      orderId: order.id,
    },
    line_items: orderProducts.map(({ product, quantity }) => ({
      price_data: {
        currency: "brl",
        product_data: {
          name: product.name,
          images: [product.imageUrl],
        },
        unit_amount: toCents(product.price),
      },
      quantity,
    })),
  });
  if (!session.url) {
    throw new Error("Missing Stripe checkout URL");
  }
  return { url: session.url };
};
