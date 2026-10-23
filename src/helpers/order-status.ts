import type { OrderStatus } from "@prisma/client";

export const getStatusLabel = (status: OrderStatus) => {
  if (status === "FINISHED") return "Pronto";
  if (status === "IN_PREPARATION") return "Em preparo";
  if (status === "PENDING") return "Pendente";
  if (status === "PAYMENT_CONFIRMED") return "Pagamento confirmado";
  if (status === "PAYMENT_FAILED") return "Pagamento falhou";
  return "";
};

// The only moves the kitchen can make
export const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  PAYMENT_CONFIRMED: "IN_PREPARATION",
  IN_PREPARATION: "FINISHED",
};
