import Stripe from "stripe";

import { db } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

// The Stripe session id is the customer's proof of ownership, so an order is only shown through it
export const getOrderBySession = async (sessionId: string | undefined) => {
  if (!sessionId?.startsWith("cs_")) {
    return null;
  }
  let session: Stripe.Checkout.Session;
  try {
    session = await getStripe().checkout.sessions.retrieve(sessionId);
  } catch (error) {
    if (error instanceof Stripe.errors.StripeInvalidRequestError) {
      return null;
    }
    throw error;
  }
  const orderId = Number(session.metadata?.orderId);
  if (!Number.isInteger(orderId)) {
    return null;
  }
  const paid = session.payment_status === "paid";
  if (paid) {
    // Same idempotent update as the webhook, so the customer never waits on it
    await db.order.updateMany({
      where: { id: orderId, status: "PENDING" },
      data: { status: "PAYMENT_CONFIRMED" },
    });
  }
  const order = await db.order.findUnique({
    where: { id: orderId },
    include: {
      restaurant: {
        select: { name: true, slug: true, avatarImageUrl: true },
      },
      orderProducts: {
        include: { product: true },
      },
    },
  });
  return order && { order, paid };
};
