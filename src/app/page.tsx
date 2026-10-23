import {
  ArrowRight,
  CreditCard,
  Github,
  MonitorSmartphone,
  ShoppingBag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import successPayment from "../../public/screenshots/sucess-payment.png";
import telaBoasVindas from "../../public/screenshots/tela-de-boas-vindas.png";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-[#1c1c1c] font-sans text-zinc-100 selection:bg-yellow-500 selection:text-black">
      <main className="container mx-auto flex flex-grow flex-col items-center justify-between gap-16 px-6 pb-12 pt-16 lg:flex-row lg:gap-8 lg:pb-24">
        <div className="z-10 flex w-full flex-1 flex-col items-center text-center lg:max-w-xl lg:items-start lg:text-left">
          <div className="mb-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <span className="flex items-center gap-1.5 rounded-full bg-black px-4 py-1.5 text-sm font-semibold text-white shadow-sm">
              <span className="rounded-sm bg-white px-1 text-[10px] font-bold text-black">
                N
              </span>{" "}
              Next.js 15
            </span>
            <span className="rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-sm font-semibold text-blue-600 shadow-sm">
              ◉ Stripe
            </span>
            <span className="rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-sm font-semibold text-emerald-600 shadow-sm">
              ◭ Prisma
            </span>
            <span className="rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-sm font-semibold text-blue-500 shadow-sm">
              PostgreSQL
            </span>
            <span className="rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-sm font-semibold text-cyan-500 shadow-sm">
              Tailwind CSS
            </span>
          </div>

          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl">
            Totem de <br /> Autoatendimento
          </h1>

          <p className="mb-10 max-w-lg text-lg leading-relaxed text-zinc-400 md:text-xl">
            Sistema completo de pedidos para restaurantes — cardápio digital,
            carrinho e pagamento via Stripe, tudo em um fluxo mobile-first.
          </p>

          <div className="flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row">
            <Link
              href="/fsw-donalds"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#3a3a3a] bg-[#2a2a2a] px-6 py-3 font-medium text-white transition-all hover:bg-[#3a3a3a] sm:w-auto"
            >
              <ArrowRight className="h-5 w-5" />
              Testar o totem
            </Link>

            <Link
              href="https://github.com/RobotEby/totem-de-autoatendimento"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#3a3a3a] bg-[#2a2a2a] px-6 py-3 font-medium text-white transition-all hover:bg-[#3a3a3a] sm:w-auto"
            >
              <Github className="h-5 w-5" />
              Ver código
            </Link>
          </div>
        </div>

        <div className="mt-12 flex w-full flex-1 items-center justify-center pb-12 lg:mt-0 lg:pb-0">
          <div className="relative h-[380px] w-[300px] sm:h-[480px] sm:w-[400px] lg:h-[550px] lg:w-[450px]">
            <div className="absolute right-0 top-12 w-[160px] animate-float-delayed overflow-hidden rounded-[1.5rem] border-[4px] border-white bg-white opacity-90 shadow-2xl sm:w-[220px] sm:rounded-[2rem] sm:border-[6px] lg:w-[280px]">
              <Image
                src={successPayment}
                alt="Tela de Sucesso"
                className="h-auto w-full object-cover"
                placeholder="blur"
                priority
              />
            </div>
            <div className="absolute left-0 top-0 z-10 w-[160px] animate-float overflow-hidden rounded-[1.5rem] border-[4px] border-white bg-white shadow-2xl sm:w-[220px] sm:rounded-[2rem] sm:border-[6px] lg:w-[280px]">
              <Image
                src={telaBoasVindas}
                alt="Tela de Boas Vindas"
                className="h-auto w-full object-cover"
                placeholder="blur"
                priority
              />
            </div>
          </div>
        </div>
      </main>

      <section className="container z-10 mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-[#3a3a3a] bg-[#2a2a2a] p-8">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-white">
              <MonitorSmartphone className="h-6 w-6 text-yellow-500" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-white">
              Cardápio digital
            </h3>
            <p className="font-medium text-zinc-400">
              Categorias, produtos, ingredientes e navegação por scroll.
            </p>
          </div>

          <div className="rounded-2xl border border-[#3a3a3a] bg-[#2a2a2a] p-8">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-white">
              <ShoppingBag className="h-6 w-6 text-yellow-500" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-white">
              Carrinho completo
            </h3>
            <p className="font-medium text-zinc-400">
              Adicionar, ajustar quantidade e remover itens em tempo real.
            </p>
          </div>

          <div className="rounded-2xl border border-[#3a3a3a] bg-[#2a2a2a] p-8">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-white">
              <CreditCard className="h-6 w-6 text-yellow-500" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-white">
              Pagamento Stripe
            </h3>
            <p className="font-medium text-zinc-400">
              Checkout Session + Webhooks com status em tempo real.
            </p>
          </div>
        </div>
      </section>

      <footer className="mt-auto border-t border-[#3a3a3a] py-8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-6 md:flex-row">
          <p className="text-center text-sm font-medium text-zinc-400 md:text-left">
            Copyright (c) 2026 RobotEby
          </p>
          <div className="flex items-center gap-6 font-medium">
            <Link
              href="https://www.linkedin.com/in/kerlon-amaral-dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-500 transition-colors hover:text-yellow-400"
            >
              LinkedIn
            </Link>
            <Link
              href="https://github.com/RobotEby/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-500 transition-colors hover:text-yellow-400"
            >
              Portfólio
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
