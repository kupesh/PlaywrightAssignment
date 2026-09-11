import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { Navigation } from '../pages/Navigation';
import { cents } from '../utils/money';
import catalog from '../test-data/catalog.json';
export const test = base.extend<{ cart: { page: CartPage; price: number } }>({
  cart: async ({ page }, use) => {
    const home = new HomePage(page);
    await home.open();
    await home.openProductByName(catalog.product);
    const product = new ProductPage(page);
    await product.waitForReady();
    await expect(product.description).not.toBeEmpty();
    const price = cents(await product.price.innerText());
    await product.addButton.click();
    const nav = new Navigation(page);
    await nav.openMenu();
    await expect(nav.badge).toHaveText('1');
    await nav.cart();
    const cart = new CartPage(page);
    await cart.assertItem(catalog.product, price, 1);
    await use({ page: cart, price });
  },
});
export { expect };
