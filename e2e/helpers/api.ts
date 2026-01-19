import { expect, APIRequestContext } from '@playwright/test';

const OK_CREATE = [200, 201];
const OK_DELETE = [200, 204];

export async function createCart(request: APIRequestContext): Promise<string> {
  const res = await request.post('/cart');
  expect(OK_CREATE).toContain(res.status());
  const { cartId } = await res.json();
  expect(cartId).toBeTruthy();
  return cartId;
}

export async function getCart(request: APIRequestContext, cartId: string) {
  const res = await request.get(`/cart/${cartId}`);
  expect(res.status()).toBe(200);
  return res.json();
}

export async function addItem(
  request: APIRequestContext,
  cartId: string,
  item: { name: string; price: number; quantity: number }
) {
  const res = await request.post(`/cart/${cartId}/items`, { data: item });
  expect(OK_CREATE).toContain(res.status());
  return res;
}

export async function removeItem(
  request: APIRequestContext,
  cartId: string,
  itemId: string
) {
  const res = await request.delete(`/cart/${cartId}/items/${itemId}`);
  expect(OK_DELETE).toContain(res.status());
}

export async function applyDiscount(
  request: any,
  cartId: string,
  code: string
) {
  return request.post(`/cart/${cartId}/discount`, {
    data: { code },
  });
}