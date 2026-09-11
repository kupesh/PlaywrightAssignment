import { expect, type Page } from '@playwright/test';
import { cents } from '../utils/money';
export class CartPage {
  constructor(readonly page: Page) {}
  row(name: string) { return this.page.getByRole('row').filter({ has: this.page.getByRole('cell', { name, exact: true }) }); }
  quantity(name: string) { return this.page.getByRole('spinbutton', { name: `Quantity for ${name}`, exact: true }); }
  get total() { return this.page.getByTestId('cart-total'); }
  get proceed() { return this.page.getByRole('button', { name: 'Proceed to checkout', exact: true }); }
  get empty() { return this.page.getByText('The cart is empty. Nothing to display.', { exact: true }); }
  async assertItem(name: string, price: number, quantity: number) {
    await expect(this.row(name)).toBeVisible();
    await expect(this.quantity(name)).toHaveValue(String(quantity));
    await expect.poll(async () => cents(await this.row(name).getByTestId('product-price').innerText())).toBe(price);
    await expect.poll(async () => cents(await this.row(name).getByTestId('line-price').innerText())).toBe(price * quantity);
    await expect.poll(async () => cents(await this.total.innerText())).toBe(price * quantity);
  }
  async changeQuantity(name: string, quantity: number) {
    await this.quantity(name).fill(String(quantity));
    await this.quantity(name).press('Tab');
  }
  async remove(name: string) {
    // Live remove anchor has no role, accessible name, href or test ID.
    await this.row(name).locator('a.btn-danger').click();
    await expect(this.empty).toBeVisible();
  }
}
