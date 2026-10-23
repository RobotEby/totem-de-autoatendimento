import { notFound } from "next/navigation";

import AutoRefresh from "@/components/auto-refresh";
import { getRestaurantBySlug } from "@/data/get-restaurant-by-slug";
import { db } from "@/lib/prisma";

const READY_WINDOW_MS = 30 * 60 * 1000;

interface BoardPageProps {
  params: Promise<{ slug: string }>;
}

const BoardPage = async ({ params }: BoardPageProps) => {
  const { slug } = await params;
  const restaurant = await getRestaurantBySlug(slug);
  if (!restaurant) {
    return notFound();
  }
  // Order numbers only: this screen is public
  const orders = await db.order.findMany({
    where: {
      restaurantId: restaurant.id,
      OR: [
        { status: { in: ["PAYMENT_CONFIRMED", "IN_PREPARATION"] } },
        {
          status: "FINISHED",
          updatedAt: { gte: new Date(Date.now() - READY_WINDOW_MS) },
        },
      ],
    },
    orderBy: { updatedAt: "asc" },
    select: { id: true, status: true },
  });
  const columns = [
    {
      title: "Preparando",
      color: "text-muted-foreground",
      orders: orders.filter((order) => order.status !== "FINISHED"),
    },
    {
      title: "Pronto",
      color: "text-green-500",
      orders: orders.filter((order) => order.status === "FINISHED").reverse(),
    },
  ];

  return (
    <div className="grid h-screen grid-cols-2 divide-x">
      <AutoRefresh />
      {columns.map((column) => (
        <div key={column.title} className="space-y-8 p-8">
          <h2 className="text-center text-3xl font-bold">{column.title}</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {column.orders.map((order) => (
              <p
                key={order.id}
                className={`text-5xl font-bold ${column.color}`}
              >
                {order.id}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BoardPage;
