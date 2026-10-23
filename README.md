# Totem de Autoatendimento

Totem de autoatendimento para restaurantes: o cliente monta o pedido, paga com cartão e acompanha o preparo, sem fila e sem atendente.

**Demonstração:** [totem-de-autoatendimento.vercel.app](https://totem-de-autoatendimento.vercel.app)

## Sumário

- [O que é](#o-que-é)
- [Como funciona](#como-funciona)
- [Telas](#telas)
- [Experimente](#experimente)
- [Como rodar no seu computador](#como-rodar-no-seu-computador)
- [Problemas comuns](#problemas-comuns)
- [Publicar na Vercel](#publicar-na-vercel)
- [Tecnologias](#tecnologias)
- [Para desenvolvedores](#para-desenvolvedores)
- [Autor e licença](#autor-e-licença)

## O que é

É o sistema daquelas telas de pedido que ficam na entrada de redes de fast food. O cliente faz tudo sozinho: escolhe os produtos, paga e recebe um número. A cozinha vê os pedidos pagos numa tela própria, e uma TV no salão avisa quando cada pedido fica pronto.

A demonstração usa o restaurante fictício **FSW Donalds**.

## Como funciona

O sistema tem três telas, uma para cada pessoa envolvida.

### Cliente (totem)

1. Escolhe **Para comer aqui** ou **Para levar**.
2. Navega pelo cardápio e adiciona produtos à sacola.
3. Informa nome e CPF e toca em **Finalizar**.
4. Paga com cartão na página segura do Stripe.
5. Recebe o **número do pedido**, numa tela que mostra o status em tempo real.

### Cozinha

A equipe abre a página da cozinha, digita a senha e vê a fila de pedidos pagos. Cada pedido tem um botão: **Iniciar preparo** e depois **Pronto**.

### Painel de chamada

Uma TV no salão mostra os números dos pedidos em duas colunas, **Preparando** e **Pronto**. Nomes não aparecem.

### Endereços

| Endereço | Para quem | O que mostra |
|---|---|---|
| `/` | Todos | Redireciona para `/fsw-donalds` |
| `/fsw-donalds` | Cliente | Totem: boas-vindas, cardápio e pagamento |
| `/fsw-donalds/kitchen` | Cozinha | Fila de pedidos (pede senha) |
| `/fsw-donalds/board` | Salão | Painel de chamada para TV |

## Telas

| Boas-vindas | Cardápio | Detalhes do produto |
|---|---|---|
| ![Boas-vindas](./public/screenshots/tela-de-boas-vindas.png) | ![Cardápio](./public/screenshots/cardapio.png) | ![Detalhes do produto](./public/screenshots/detalhes-produto.png) |

| Sacola | Finalizar pedido | Pagamento (Stripe) |
|---|---|---|
| ![Sacola](./public/screenshots/sacola.png) | ![Finalizar pedido](./public/screenshots/finalizar-pedido.png) | ![Pagamento](./public/screenshots/checkout-stripe.png) |

| Cardápio por categoria | Pagamento confirmado |
|---|---|
| ![Cardápio por categoria](./public/screenshots/cardapio-bebidas.png) | ![Pagamento confirmado](./public/screenshots/sucess-payment.png) |

## Experimente

Abra a [demonstração](https://totem-de-autoatendimento.vercel.app) e faça um pedido. O pagamento está em modo de teste, então nenhuma cobrança é real. Use estes dados:

| Campo | Valor |
|---|---|
| Número do cartão | `4242 4242 4242 4242` |
| Validade | Qualquer data futura |
| CVC | Quaisquer 3 dígitos |
| CPF | Um CPF válido, por exemplo `529.982.247-25` |

## Como rodar no seu computador

### Você vai precisar de

- [Node.js](https://nodejs.org/) 22.18 ou superior
- [Docker](https://www.docker.com/), para o banco de dados. Qualquer PostgreSQL também serve.
- Uma conta gratuita no [Stripe](https://dashboard.stripe.com/register). O modo de teste é suficiente.

### 1. Baixe o projeto e instale as dependências

```bash
git clone https://github.com/RobotEby/totem-de-autoatendimento.git
cd totem-de-autoatendimento
npm install
```

### 2. Suba o banco de dados

```bash
docker run --name totem-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=totem -p 5432:5432 -d postgres:17-alpine
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Abra o arquivo `.env` e preencha:

| Variável | O que colocar |
|---|---|
| `DATABASE_URL` | Com o Docker do passo 2: `postgresql://postgres:postgres@localhost:5432/totem` |
| `STRIPE_SECRET_KEY` | A **Secret key** do [painel do Stripe](https://dashboard.stripe.com/test/apikeys). Ela começa com `sk_test_`. A *Publishable key* (`pk_test_`) não serve. |
| `STRIPE_WEBHOOK_SECRET_KEY` | Opcional para começar. Veja o passo 6. |
| `KITCHEN_PASSWORD` | Uma senha à sua escolha para entrar na página da cozinha |

### 4. Crie as tabelas e o cardápio de exemplo

```bash
npx prisma migrate dev
npx prisma db seed
```

### 5. Inicie o projeto

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). Se a porta 3000 estiver ocupada, o terminal mostra qual porta foi usada.

### 6. Webhook do Stripe (opcional)

Sem o webhook, o pagamento já é confirmado quando o cliente volta do Stripe. O webhook serve para marcar como "Pagamento falhou" os pedidos abandonados e como garantia caso o cliente feche a página antes de voltar.

1. Instale o [Stripe CLI](https://docs.stripe.com/stripe-cli) e faça login com `stripe login`.
2. Em outro terminal, deixe rodando (troque `3000` pela porta do seu `npm run dev`):

   ```bash
   stripe listen --events checkout.session.completed,checkout.session.expired --forward-to localhost:3000/api/webhooks/stripe
   ```

3. Copie o valor `whsec_...` que aparece no terminal para `STRIPE_WEBHOOK_SECRET_KEY` no `.env`.
4. Reinicie o `npm run dev`.

## Problemas comuns

| O que aparece | Como resolver |
|---|---|
| `Environment variable not found: DATABASE_URL` | O arquivo `.env` não existe ou o servidor foi iniciado antes dele. Faça o passo 3 e reinicie o `npm run dev`. |
| "Não foi possível finalizar o pedido" | `STRIPE_SECRET_KEY` está vazia, ainda com o valor de exemplo ou com a chave `pk_test_`. Use a chave `sk_test_` e reinicie. |
| `must specify events to forward` no `stripe listen` | Inclua `--events`, como no passo 6. |
| Mudei o `.env` e nada mudou | O `.env` só é lido quando o servidor inicia. Reinicie o `npm run dev`. |
| A cozinha pede a senha sem parar | Confira `KITCHEN_PASSWORD` no `.env`. O nome de usuário pode ser qualquer um. |
| Pedido fica em "Pendente" | O pagamento não foi concluído. Se o cliente pagou e fechou a página, o webhook (passo 6) confirma o pedido. |

## Publicar na Vercel

O projeto roda na Vercel sem configuração extra.

1. Cadastre `DATABASE_URL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET_KEY` e `KITCHEN_PASSWORD` nas variáveis de ambiente do projeto.
2. No Stripe, em **Developers → Webhooks**, crie um endpoint para `https://<seu-domínio>/api/webhooks/stripe`.
3. Selecione os eventos `checkout.session.completed` e `checkout.session.expired`.
4. Copie o *signing secret* do endpoint para `STRIPE_WEBHOOK_SECRET_KEY`.

As migrations do banco rodam sozinhas: em deploys de produção, o `npm run build` executa `prisma migrate deploy` antes de gerar o site. Previews e builds locais não mexem no banco.

## Tecnologias

| Tecnologia | Uso |
|---|---|
| Next.js 16 e React 19 | Aplicação web, páginas e servidor |
| TypeScript | Tipagem do código |
| PostgreSQL e Prisma | Banco de dados |
| Stripe | Pagamento com cartão |
| Tailwind CSS e shadcn/ui | Visual e componentes |
| React Hook Form e Zod | Formulários e validação |

## Para desenvolvedores

### Estrutura de pastas

```text
src/
├── app/
│   ├── api/webhooks/stripe/route.ts  # webhook do Stripe
│   └── [slug]/                       # tudo de um restaurante
│       ├── page.tsx                  # boas-vindas
│       ├── contexts/cart.tsx         # carrinho (um por restaurante)
│       ├── menu/                     # cardápio, produto, sacola e createOrder
│       ├── success/                  # confere o pagamento e anima a confirmação
│       ├── orders/[orderId]/         # tela do pedido (exige session_id)
│       ├── kitchen/                  # painel da cozinha e advanceOrder
│       └── board/                    # painel de chamada
├── components/                       # AutoRefresh e componentes shadcn/ui
├── data/                             # consultas usadas em mais de um lugar
├── helpers/                          # funções puras: CPF, moeda e status
├── lib/                              # Prisma, Stripe e senha da cozinha
└── proxy.ts                          # protege /[slug]/kitchen com senha
prisma/                               # schema, migrations e seed
tests/                                # testes com node:test
```

### Fluxo do pedido

```text
Cliente finaliza  →  createOrder() grava o pedido (PENDING) e cria a sessão no Stripe
                  →  cliente paga no Stripe
                  →  /success consulta a sessão: paga → PAYMENT_CONFIRMED
                  →  tela do pedido /orders/{id}?session_id=…
Cozinha           →  IN_PREPARATION  →  FINISHED ("Pronto" no painel)
Não pagou         →  sessão expira em 31 min  →  webhook marca PAYMENT_FAILED
```

### Segurança e decisões

- **Preços vêm sempre do banco.** O carrinho envia só `id` e quantidade. O valor gravado e o cobrado no Stripe saem das mesmas linhas.
- **Valores em centavos (`Int`).** É o formato que o Stripe usa, e evita erros de arredondamento. Só `formatCurrency` divide por 100 para exibir.
- **Pagamento confirmado só pelo Stripe.** Pelo webhook assinado ou pela sessão consultada no servidor. Nada que vem do navegador marca um pedido como pago.
- **A sessão do Stripe prova quem é o dono do pedido.** A tela do pedido só abre com o `session_id` daquele pedido. Num totem compartilhado, ninguém vê pedidos de outra pessoa.
- **Senha da cozinha conferida duas vezes.** No `proxy.ts` e de novo na Server Action, porque Server Actions podem ser chamadas de qualquer página.
- **Atualizações idempotentes.** Webhook e cozinha só mudam o status a partir do estado esperado. Eventos repetidos ou clique duplo não pulam etapas.
- **Sem pedido órfão.** Se o Stripe falhar ao criar a sessão, o pedido é marcado como `PAYMENT_FAILED`.

### Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Inicia em modo de desenvolvimento |
| `npm run build` | Gera a versão de produção e checa os tipos |
| `npm start` | Inicia a versão de produção |
| `npm run lint` | Verifica o código com ESLint |
| `npm test` | Roda os testes (CPF, centavos, senha da cozinha e status) |
| `npx prisma studio` | Abre uma interface para ver e editar o banco |
| `npx prisma db seed` | Recria o cardápio de exemplo (apaga os restaurantes existentes) |

### Limitações conhecidas

1. **Uma senha compartilhada na cozinha.** Não há usuários individuais nem registro de quem avançou cada pedido.
2. **Atualização a cada 10 segundos.** A tela do pedido, a cozinha e o painel consultam o servidor periodicamente. Com muitas telas abertas, vale trocar por WebSockets ou Server-Sent Events.
3. **Link do pedido no histórico do navegador.** Ele dá acesso apenas àquele pedido (itens e total, sem nome nem CPF). Num totem, use o navegador em modo quiosque.

## Autor e licença

Desenvolvido por **RobotEby**.

- LinkedIn: [kerlon-amaral-dev](https://www.linkedin.com/in/kerlon-amaral-dev/)
- GitHub: [@RobotEby](https://github.com/RobotEby)

Distribuído sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE).
