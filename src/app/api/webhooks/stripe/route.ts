import { NextResponse } from "next/server";
import Stripe from "stripe";

import { db } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const stripe = getStripe();

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_KEY;
  if (!webhookSecret) {
    throw new Error("Missing Stripe webhook secret key");
  }
  const text = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(text, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.expired"
  ) {
    const orderId = event.data.object.metadata?.orderId;
    if (orderId) {
      await db.order.updateMany({
        where: { id: Number(orderId), status: "PENDING" },
        data: {
          status:
            event.type === "checkout.session.completed"
              ? "PAYMENT_CONFIRMED"
              : "PAYMENT_FAILED",
        },
      });
    }
  }

  return NextResponse.json({
    received: true,
  });
}
