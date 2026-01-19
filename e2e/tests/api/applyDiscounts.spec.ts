import { test, expect } from '@playwright/test';
import { createCart, addItem, getCart, applyDiscount } from '../../helpers/api';

const ITEM_PRICE = 100;
const ITEM_QTY = 2;
const SUBTOTAL = ITEM_PRICE * ITEM_QTY;

const discountCases = [
  { code: 'SAVE10', rate: 0.10 },
  { code: 'SAVE20', rate: 0.20 },
  { code: 'HALF',   rate: 0.50 },
] as const;

test.describe('POST /cart/:cartId/discount', () => {
  for (const { code, rate } of discountCases) {
    test(`positive: applies ${code} discount`, { tag: ['@api'] }, async ({ request }) => {
      const cartId = await createCart(request);
      await addItem(request, cartId, { name: 'Apple', price: ITEM_PRICE, quantity: ITEM_QTY });
      const discountRes = await applyDiscount(request, cartId, code);
      expect([200, 201]).toContain(discountRes.status());
      const cart = await getCart(request, cartId);
      const expectedDiscount = SUBTOTAL * rate;
      expect(cart.subtotal).toBe(SUBTOTAL);
      expect(cart.discount).toBe(expectedDiscount);
      expect(cart.total).toBe(SUBTOTAL - expectedDiscount);
    });
  }

  test('negative: invalid discount code returns error and does not change totals', 
     { tag: ['@api', '@negative'] },
      async ({ request }) => {
    const cartId = await createCart(request);
    await addItem(request, cartId, { name: 'Apple', price: ITEM_PRICE, quantity: 1 });
    const res = await applyDiscount(request, cartId, 'INVALID');
    expect([400, 422]).toContain(res.status());
    const cart = await getCart(request, cartId);
    expect(cart.subtotal).toBe(ITEM_PRICE);
    expect(cart.discount).toBe(0);
    expect(cart.total).toBe(ITEM_PRICE);
  });
});