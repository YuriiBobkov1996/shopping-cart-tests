import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { CartPage } from '../../pages/CartPage';

const ITEM_PRICE = 100;
const ITEM_QTY = 2;
const SUBTOTAL = ITEM_PRICE * ITEM_QTY;
const INVALID_PRICE = -10;
const INVALID_QTY = 0;

const discountCases = [
  { code: 'SAVE10', rate: 0.10 },
  { code: 'SAVE20', rate: 0.20 },
  { code: 'HALF',   rate: 0.50 },
];

test.describe('UI: Shopping Cart', () => {

  test('Adding items through the UI + Correct display of prices and totals',
    { tag: ['@ui', '@smoke'] },
    async ({ page }) => {
    const cart = new CartPage(page);
    await cart.goto();

    const item = {
      name: faker.commerce.productName(),
      price: ITEM_PRICE,
      quantity: ITEM_QTY,
    };

    await cart.addItem(item);
    await expect(cart.itemRowByName(item.name)).toBeVisible();
    await cart.expectTotals(SUBTOTAL, 0, SUBTOTAL);
  });

  test.describe('Applying discount codes through the UI + Discount calculation accuracy', () => {
    for (const { code, rate } of discountCases) {
      test(`UI: applies ${code} discount correctly`, { tag: ['@ui'] }, async ({ page }) => {
        const cart = new CartPage(page);
        await cart.goto();

        const item = {
          name: faker.commerce.productName(),
          price: ITEM_PRICE,
          quantity: ITEM_QTY,
        };

        await cart.addItem(item);
        await cart.applyDiscount(code);
        const discount = SUBTOTAL * rate;
        const total = SUBTOTAL - discount;
        await cart.expectTotals(SUBTOTAL, discount, total);
      });
    }
  });

  test('Removing items through the UI + totals reset', { tag: ['@ui'] }, async ({ page }) => {
    const cart = new CartPage(page);
    await cart.goto();
    const item = {
      name: faker.commerce.productName(),
      price: ITEM_PRICE,
      quantity: ITEM_QTY,
    };
    await cart.addItem(item);
    await cart.removeItemByName(item.name);
    await expect(cart.itemRowByName(item.name)).toBeHidden();
    await cart.expectTotals(0, 0, 0);
  });

  test('Form validation: invalid values are blocked by UI',
    { tag: ['@ui', '@negative'] },
    async ({ page }) => {
    const cart = new CartPage(page);
    await cart.goto();
    await cart.addItem({
      name: '',
      price: INVALID_PRICE,
      quantity: INVALID_QTY,
    });

    const priceValid = await cart.priceInput.evaluate(
      (el: HTMLInputElement) => el.checkValidity()
    );
    expect(priceValid).toBe(false);
    const qtyValid = await cart.quantityInput.evaluate(
      (el: HTMLInputElement) => el.checkValidity()
    );
    expect(qtyValid).toBe(false);
    await cart.expectTotals(0, 0, 0);
  });
});
