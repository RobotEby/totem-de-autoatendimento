import { OrderStatus } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import AutoRefresh from "@/components/auto-refresh";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getOrderBySession } from "@/data/get-order-by-session";
import { formatCurrency } from "@/helpers/format-currency";
import { getStatusLabel } from "@/helpers/order-status";

interface OrderPageProps {
  params: Promise<{ slug: string; orderId: string }>;
  searchParams: Promise<{ session_id?: string }>;
}

const OrderPage = async ({ params, searchParams }: OrderPageProps) => {
  const { slug, orderId } = await params;
  const { session_id } = await searchParams;
  const result = await getOrderBySession(session_id);
  if (
    !result ||
    result.order.id !== Number(orderId) ||
    result.order.restaurant.slug !== slug
  ) {
    return notFound();
  }
  const { order } = result;

  return (
    <div className="space-y-6 p-6">
      <AutoRefresh />

      <div className="space-y-1 text-center">
        <p className="text-sm text-muted-foreground">Seu pedido</p>
        <h2 className="text-5xl font-bold">#{order.id}</h2>
        <p className="text-sm text-muted-foreground">
          {order.consumptionMethod === "DINE_IN"
            ? "Para comer aqui"
            : "Para levar"}
        </p>
      </div>

      <Card>
        <CardContent className="space-y-4 p-5">
          <div
            className={`w-fit rounded-full px-2 py-1 text-xs font-semibold text-white ${
              (
                [
                  OrderStatus.PAYMENT_CONFIRMED,
                  OrderStatus.FINISHED,
                ] as OrderStatus[]
              ).includes(order.status)
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {getStatusLabel(order.status)}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative h-5 w-5">
              <Image
                src={order.restaurant.avatarImageUrl}
                alt={order.restaurant.name}
                className="rounded-sm"
                fill
              />
            </div>
            <p className="text-sm font-semibold">{order.restaurant.name}</p>
          </div>

          <Separator />

          <div className="space-y-2">
            {order.orderProducts.map((orderProduct) => (
              <div key={orderProduct.id} className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-400 text-xs font-semibold text-white">
                  {orderProduct.quantity}
                </div>
                <p className="text-sm">{orderProduct.product.name}</p>
              </div>
            ))}
          </div>

          <Separator />

          <p className="text-sm font-medium">{formatCurrency(order.total)}</p>
        </CardContent>
      </Card>

      <Button asChild className="w-full rounded-full">
        <Link href={`/${slug}`}>Fazer novo pedido</Link>
      </Button>
    </div>
  );
};

export default OrderPage;
