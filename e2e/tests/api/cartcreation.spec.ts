import { test, expect } from '@playwright/test';

test('POST /cart creates a new cart and returns cartId', { tag: ['@api', '@smoke'] }, async ({ request }) => {
  const res = await request.post('/cart');
  expect([200, 201]).toContain(res.status());
  const body = await res.json();
  expect(body).toHaveProperty('cartId');
  expect(body.cartId).toBeTruthy();
  expect(typeof body.cartId).toBe('string');
});
