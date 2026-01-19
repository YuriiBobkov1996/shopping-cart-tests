import { test, expect } from '@playwright/test';
import { createCart, addItem, getCart, removeItem } from '../../helpers/api';

test.describe('DELETE /cart/:cartId/items/:itemId', () => {
  const ITEM = { name: 'Apple', price: 100, quantity: 2 };
  test('positive: removes item from cart', { tag: ['@api'] }, async ({ request }) => {
    const cartId = await createCart(request);
    await addItem(request, cartId, ITEM);
    const before = await getCart(request, cartId);
    expect(before.items.length).toBeGreaterThan(0);
    const added = before.items.find((i: any) => i.name === ITEM.name);
    expect(added).toBeTruthy();
    const itemId = added.id ?? added.itemId;
    expect(itemId).toBeTruthy();
    await removeItem(request, cartId, itemId);
    const after = await getCart(request, cartId);
    expect(after.items).toEqual([]);
    expect(after.subtotal).toBe(0);
    expect(after.discount).toBe(0);
    expect(after.total).toBe(0);
  });

  test('negative: removing unknown itemId returns error', { tag: ['@api', '@negative'] }, async ({ request }) => {
    const cartId = await createCart(request);
    const res = await request.delete(
      `/cart/${cartId}/items/00000000-0000-0000-0000-000000000000`
    );
    expect([400, 404]).toContain(res.status());
  });

  test('negative: removing item from unknown cartId returns error', { tag: ['@api', '@negative'] }, async ({ request }) => {
    const res = await request.delete(
      `/cart/00000000-0000-0000-0000-000000000000/items/00000000-0000-0000-0000-000000000000`
    );
    expect([400, 404]).toContain(res.status());
  });
});