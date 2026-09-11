import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ProductPage } from '../pages/ProductPage';
import { cents } from '../utils/money';
import catalog from '../test-data/catalog.json';

test.describe('Toolshop catalog smoke scenarios', () => {
  test('CAT-001 catalog exposes purchasable products', async ({ page }) => {
    const home = new HomePage(page);
    await home.open();
    const price = cents(await home.card(catalog.product).getByTestId('product-price').innerText());
    expect(price).toBeGreaterThan(0);
    await home.openProductByName(catalog.product);
    const product = new ProductPage(page);
    await product.waitForReady();
    await expect(product.title).toHaveText(catalog.product);
    expect(cents(await product.price.innerText())).toBe(price);
  });
  test('CAT-002 keyword search returns matching products', async ({ page }) => {
    const home = new HomePage(page);
    await home.open();
    await home.searchBy(catalog.searchTerm);
    await expect(home.searchTerm).toHaveText(catalog.searchTerm);
    const names = await home.names.allTextContents();
    expect(names.length).toBeGreaterThan(0);
    for (const name of names) expect(name.toLowerCase()).toContain(catalog.searchTerm);
  });
  test('CAT-003 no-match search can be reset', async ({ page }) => {
    const home = new HomePage(page);
    await home.open();
    await home.searchBy(catalog.unmatchedTerm);
    await expect(home.noResults).toBeVisible();
    await expect(home.names).toHaveCount(0);
    await home.clearSearch();
    await expect(home.searchInput).toHaveValue('');
    await expect(home.card(catalog.product)).toBeVisible();
  });
  test('CAT-004 category filter restricts results', async ({ page }) => {
    const home = new HomePage(page);
    await home.open();
    const results = await home.filterBy(catalog.category);
    await expect(home.category(catalog.category)).toBeChecked();
    expect(results.length).toBeGreaterThan(0);
    for (const result of results) expect(result.category.name).toBe(catalog.category);
    await home.openProductByName(catalog.product);
    await expect(new ProductPage(page).category).toHaveText(catalog.category);
  });
  test('CAT-005 price sort orders visible results', async ({ page }) => {
    const home = new HomePage(page);
    await home.open();
    for (const [label, direction] of [[catalog.ascending, 1], [catalog.descending, -1]] as const) {
      await home.sortBy(label);
      const prices = (await home.prices.allTextContents()).map(cents);
      expect(prices.length).toBeGreaterThan(1);
      expect(prices).toEqual([...prices].sort((a, b) => direction * (a - b)));
    }
  });
});
