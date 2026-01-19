import { Page, Locator, expect } from '@playwright/test';
export class CartPage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly priceInput: Locator;
  readonly quantityInput: Locator;
  readonly addItemBtn: Locator;
  readonly discountInput: Locator;
  readonly applyBtn: Locator;
  readonly orderSummary: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.locator('#itemName');
    this.priceInput = page.locator('#itemPrice');
    this.quantityInput = page.locator('#itemQuantity');
    this.addItemBtn = page.getByRole('button', { name: 'Add to Cart' });
    this.discountInput = page.locator('#discountCode');
    this.applyBtn = page.getByRole('button', { name: 'Apply' });
    this.orderSummary = page.locator('.section').filter({ hasText: 'Order Summary' });
  }

  async goto() {
    await this.page.goto('/');
  }

  async addItem(item: { name: string; price: number; quantity: number }) {
    await this.nameInput.fill(item.name);
    await this.priceInput.fill(String(item.price));
    await this.quantityInput.fill(String(item.quantity));
    await this.addItemBtn.click();
  }

  itemRowByName(name: string): Locator {
    return this.page.locator('#cartItems .cart-item', {
      has: this.page.getByText(name, { exact: true }),
    });
  }

  async removeItemByName(name: string) {
    await this.itemRowByName(name)
      .getByRole('button', { name: 'Remove' })
      .click();
  }

  async applyDiscount(code: string) {
    await this.discountInput.fill(code);

    this.page.once('dialog', async (dialog) => {
      await dialog.accept();
    });

    await this.applyBtn.click();
  }

  async expectTotals(subtotal: number, discount: number, total: number) {
    await expect(this.orderSummary).toContainText(`Subtotal:`);
    await expect(this.orderSummary).toContainText(String(subtotal));
    await expect(this.orderSummary).toContainText(`Discount:`);
    await expect(this.orderSummary).toContainText(String(discount));
    await expect(this.orderSummary).toContainText(`Total:`);
    await expect(this.orderSummary).toContainText(String(total));
  }
}