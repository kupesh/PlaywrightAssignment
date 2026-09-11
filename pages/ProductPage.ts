import { expect, type Page } from '@playwright/test';
export class ProductPage {
  constructor(readonly page: Page) {}
  get title() { return this.page.getByRole('heading', { level: 1 }); }
  get price() { return this.page.getByTestId('unit-price'); }
  get description() { return this.page.getByTestId('product-description'); }
  get addButton() { return this.page.getByRole('button', { name: 'Add to cart', exact: true }); }
  get category() { return this.page.getByLabel('category', { exact: true }); }

  async waitForReady() {
    await expect(this.description).toBeVisible({ timeout: 10_000 });
    await expect(this.price).toBeVisible({ timeout: 10_000 });
    await expect(this.addButton).toBeVisible({ timeout: 10_000 });
    await expect(this.addButton).toBeEnabled({ timeout: 15_000 });
  }
}
