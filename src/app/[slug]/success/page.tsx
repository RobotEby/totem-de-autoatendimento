import { notFound, redirect } from "next/navigation";

import { getOrderBySession } from "@/data/get-order-by-session";

import SuccessAnimation from "./components/success-animation";

interface SuccessPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ session_id?: string }>;
}

const SuccessPage = async ({ params, searchParams }: SuccessPageProps) => {
  const { slug } = await params;
  const { session_id } = await searchParams;
  const result = await getOrderBySession(session_id);
  if (!result || result.order.restaurant.slug !== slug) {
    return notFound();
  }
  const orderUrl = `/${slug}/orders/${result.order.id}?session_id=${session_id}`;
  if (!result.paid) {
    redirect(orderUrl);
  }
  return <SuccessAnimation redirectTo={orderUrl} />;
};

export default SuccessPage;
