import { expect, type Page } from '@playwright/test';
export class Navigation {
  constructor(readonly page: Page) {}
  get badge() { return this.page.getByTestId('cart-quantity'); }
  async openMenu() {
    const toggle = this.page.getByRole('button', { name: 'Toggle navigation', exact: true });
    if (await toggle.isVisible() && await toggle.getAttribute('aria-expanded') !== 'true') await toggle.click();
  }
  async cart() {
    await this.openMenu();
    await this.page.getByRole('link', { name: 'cart', exact: true }).click();
    // Wait for the cart page to be interactable – ensure the proceed button is visible.
    await this.page.getByRole('button', { name: 'Proceed to checkout', exact: true }).waitFor({ state: 'visible', timeout: 10_000 });
  }
  
  async home() { await this.openMenu(); await this.page.getByRole('link', { name: 'Home', exact: true }).click(); await expect(this.page).toHaveURL(/\/$/); }
}
