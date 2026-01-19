import { test, expect } from '@playwright/test';
import { createCart, addItem, getCart } from '../../helpers/api';

test.describe('POST /cart/:cartId/items', () => {
  const VALID_ITEM = {
  name: 'Apple',
  price: 100,
  quantity: 2,
};
  const invalidCases = [
  { ...VALID_ITEM, price: -10 },
  { ...VALID_ITEM, quantity: 0 },
  { ...VALID_ITEM, quantity: -1 },
  { price: VALID_ITEM.price, quantity: VALID_ITEM.quantity },
  { name: VALID_ITEM.name, quantity: VALID_ITEM.quantity },
  { name: VALID_ITEM.name, price: VALID_ITEM.price },        
  { ...VALID_ITEM, name: '' },
];
  const EXPECTED_SUBTOTAL = VALID_ITEM.price * VALID_ITEM.quantity;

  test('positive: adds item to cart', { tag: ['@api', '@smoke'] }, async ({ request }) => {
    const cartId = await createCart(request);
    await addItem(request, cartId, VALID_ITEM);
    const cart = await getCart(request, cartId);
    expect(cart.items.length).toBeGreaterThan(0);
    expect(cart.subtotal).toBe(EXPECTED_SUBTOTAL);
    expect(cart.discount).toBe(0);
    expect(cart.total).toBe(EXPECTED_SUBTOTAL);
    const added = cart.items.find((i: any) => i.name === VALID_ITEM.name);
    expect(added).toBeTruthy();
    expect(added.price).toBe(VALID_ITEM.price);
    expect(added.quantity).toBe(VALID_ITEM.quantity);
    expect(added.id ?? added.itemId).toBeTruthy();
  });

  test('negative: rejects invalid item data', { tag: ['@api', '@negative'] }, async ({ request }) => {
  const cartId = await createCart(request);
  for (const data of invalidCases) {
    const res = await request.post(`/cart/${cartId}/items`, { data });
    expect([400, 422]).toContain(res.status());
  }
  const cart = await getCart(request, cartId);
  expect(cart.items).toEqual([]);
  expect(cart.subtotal).toBe(0);
  expect(cart.discount).toBe(0);
  expect(cart.total).toBe(0);
});
});