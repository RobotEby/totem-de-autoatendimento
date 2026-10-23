import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { isValidCpf, removeCpfPunctuation } from "../src/helpers/cpf.ts";
import { formatCurrency } from "../src/helpers/format-currency.ts";
import { NEXT_STATUS } from "../src/helpers/order-status.ts";
import { isKitchenAuthorized } from "../src/lib/kitchen-auth.ts";

test("isValidCpf checks the verifier digits", () => {
  assert.equal(isValidCpf("529.982.247-25"), true);
  assert.equal(isValidCpf("529.982.247-24"), false);
  assert.equal(isValidCpf("000.000.000-00"), false);
  assert.equal(isValidCpf("123"), false);
});

test("removeCpfPunctuation keeps only digits", () => {
  assert.equal(removeCpfPunctuation("529 982.247-25"), "52998224725");
});

test("every seeded price is stored as whole cents", () => {
  const seed = readFileSync(new URL("../prisma/seed.ts", import.meta.url), "utf8");
  const prices = [...seed.matchAll(/price: ([\d.]+)/g)].map((m) => Number(m[1]));
  assert.ok(prices.length > 0);
  for (const price of prices) {
    assert.ok(Number.isInteger(price), `price ${price}`);
  }
});

test("formatCurrency takes cents", () => {
  assert.equal(formatCurrency(4280).replace(/\s/g, " "), "R$ 42,80");
});

test("kitchen moves orders only forward through preparation", () => {
  assert.equal(NEXT_STATUS.PAYMENT_CONFIRMED, "IN_PREPARATION");
  assert.equal(NEXT_STATUS.IN_PREPARATION, "FINISHED");
  assert.equal(NEXT_STATUS.PENDING, undefined);
  assert.equal(NEXT_STATUS.FINISHED, undefined);
});

test("isKitchenAuthorized checks the Basic Auth password", () => {
  const basic = (credentials) =>
    `Basic ${Buffer.from(credentials).toString("base64")}`;
  process.env.KITCHEN_PASSWORD = "s3cret";
  assert.equal(isKitchenAuthorized(basic("cozinha:s3cret")), true);
  assert.equal(isKitchenAuthorized(basic("cozinha:wrong")), false);
  assert.equal(isKitchenAuthorized(basic("s3cret")), false);
  assert.equal(isKitchenAuthorized("Bearer s3cret"), false);
  assert.equal(isKitchenAuthorized(null), false);
  delete process.env.KITCHEN_PASSWORD;
  assert.equal(isKitchenAuthorized(basic("cozinha:s3cret")), false);
});
