import { notFound } from "next/navigation";

import AutoRefresh from "@/components/auto-refresh";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getRestaurantBySlug } from "@/data/get-restaurant-by-slug";
import { getStatusLabel } from "@/helpers/order-status";
import { db } from "@/lib/prisma";

import { advanceOrder } from "./actions/advance-order";

interface KitchenPageProps {
  params: Promise<{ slug: string }>;
}

const KitchenPage = async ({ params }: KitchenPageProps) => {
  const { slug } = await params;
  const restaurant = await getRestaurantBySlug(slug);
  if (!restaurant) {
    return notFound();
  }
  const orders = await db.order.findMany({
    where: {
      restaurantId: restaurant.id,
      status: { in: ["PAYMENT_CONFIRMED", "IN_PREPARATION"] },
    },
    orderBy: { createdAt: "asc" },
    include: { orderProducts: { include: { product: true } } },
  });

  return (
    <div className="space-y-6 p-6">
      <AutoRefresh />
      <h2 className="text-lg font-semibold">Cozinha · {restaurant.name}</h2>

      {orders.length === 0 && (
        <p className="text-sm text-muted-foreground">Nenhum pedido na fila.</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardContent className="space-y-4 p-5">
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">#{order.id}</p>
                <span className="rounded-full bg-gray-200 px-2 py-1 text-xs font-semibold text-gray-500">
                  {getStatusLabel(order.status)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {order.customerName.split(" ")[0]} ·{" "}
                {order.consumptionMethod === "DINE_IN"
                  ? "Para comer aqui"
                  : "Para levar"}
              </p>

              <Separator />

              <div className="space-y-2">
                {order.orderProducts.map((orderProduct) => (
                  <div
                    key={orderProduct.id}
                    className="flex items-center gap-2"
                  >
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-400 text-xs font-semibold text-white">
                      {orderProduct.quantity}
                    </div>
                    <p className="text-sm">{orderProduct.product.name}</p>
                  </div>
                ))}
              </div>

              <form
                action={advanceOrder.bind(null, order.id, order.status, slug)}
              >
                <Button
                  type="submit"
                  variant={
                    order.status === "IN_PREPARATION"
                      ? "default"
                      : "destructive"
                  }
                  className="w-full rounded-full"
                >
                  {order.status === "IN_PREPARATION"
                    ? "Pronto"
                    : "Iniciar preparo"}
                </Button>
              </form>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default KitchenPage;
