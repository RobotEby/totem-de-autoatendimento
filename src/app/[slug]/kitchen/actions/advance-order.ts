"use server";

import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { NEXT_STATUS } from "@/helpers/order-status";
import { isKitchenAuthorized } from "@/lib/kitchen-auth";
import { db } from "@/lib/prisma";

export const advanceOrder = async (
  orderId: number,
  from: OrderStatus,
  slug: string,
) => {
  // Server actions can be called from any page, so the proxy alone does not protect this
  if (!isKitchenAuthorized((await headers()).get("authorization"))) {
    throw new Error("Unauthorized");
  }
  const to = NEXT_STATUS[from];
  if (!to) {
    throw new Error("Invalid status transition");
  }
  // Matching on the current status makes a double click a no-op
  await db.order.updateMany({
    where: { id: orderId, status: from, restaurant: { slug } },
    data: { status: to },
  });
  revalidatePath(`/${slug}/kitchen`);
};
