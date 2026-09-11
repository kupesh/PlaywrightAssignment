import { test, expect } from '../fixtures/test';
import { Navigation } from '../pages/Navigation';
import catalog from '../test-data/catalog.json';

test('CART-001 product details add the selected item to cart', { tag: '@mobile' }, async ({ cart, page }) => {
  await cart.page.assertItem(catalog.product, cart.price, 1);
  await expect(new Navigation(page).badge).toHaveText('1');
});
test('CART-002 quantity changes recalculate the cart total', { tag: '@mobile' }, async ({ cart, page }) => {
  await cart.page.changeQuantity(catalog.product, 2);
  await cart.page.assertItem(catalog.product, cart.price, 2);
  await page.reload();
  await cart.page.assertItem(catalog.product, cart.price, 2);
});
test('CART-003 removing the last item empties the cart', async ({ cart, page }) => {
  await cart.page.remove(catalog.product);
  await expect(cart.page.row(catalog.product)).toHaveCount(0);
  await expect(cart.page.proceed).toHaveCount(0);
  await expect(new Navigation(page).badge).toHaveCount(0);
  await page.reload();
  await expect(cart.page.empty).toBeVisible();
  await expect(cart.page.row(catalog.product)).toHaveCount(0);
  await expect(cart.page.proceed).toHaveCount(0);
  await expect(new Navigation(page).badge).toHaveCount(0);
});
