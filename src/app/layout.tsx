import "./globals.css";

import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Totem de Autoatendimento | FSW Donalds",
  description: "Sistema full-stack de pedidos para restaurantes com Next.js, Stripe e Prisma.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${poppins.className} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}