import { CartProvider } from "./contexts/cart";

export default function RestaurantLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <CartProvider>{children}</CartProvider>;
}
