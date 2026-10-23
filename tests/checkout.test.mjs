import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { isValidCpf, removeCpfPunctuation } from "../src/helpers/cpf.ts";
import { toCents } from "../src/helpers/format-currency.ts";

test("isValidCpf checks the verifier digits", () => {
  assert.equal(isValidCpf("529.982.247-25"), true);
  assert.equal(isValidCpf("529.982.247-24"), false);
  assert.equal(isValidCpf("000.000.000-00"), false);
  assert.equal(isValidCpf("123"), false);
});

test("removeCpfPunctuation keeps only digits", () => {
  assert.equal(removeCpfPunctuation("529 982.247-25"), "52998224725");
});

test("every seeded price becomes whole cents for Stripe", () => {
  const seed = readFileSync(new URL("../prisma/seed.ts", import.meta.url), "utf8");
  const prices = [...seed.matchAll(/price: ([\d.]+)/g)].map((m) => Number(m[1]));
  assert.ok(prices.length > 0);
  for (const price of prices) {
    assert.ok(Number.isInteger(toCents(price)), `price ${price}`);
  }
  assert.equal(toCents(36.2), 3620);
});
