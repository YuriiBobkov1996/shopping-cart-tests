import { test, expect } from '@playwright/test';
import { createCart, getCart } from '../../helpers/api';

test('GET /cart/:cartId returns empty cart with zero totals',{ tag: ['@api', '@smoke'] }, async ({ request }) => {
  const cartId = await createCart(request);
  const cart = await getCart(request, cartId);
  expect(cart.items).toEqual([]);
  expect(cart.subtotal).toBe(0);
  expect(cart.discount).toBe(0);
  expect(cart.total).toBe(0);
  expect(typeof cart.subtotal).toBe('number');
  expect(typeof cart.discount).toBe('number');
  expect(typeof cart.total).toBe('number');
});