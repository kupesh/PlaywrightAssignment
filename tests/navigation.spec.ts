import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { Navigation } from '../pages/Navigation';
import catalog from '../test-data/catalog.json';

test('NAV-001 customer can return from a product to the catalog', { tag: '@mobile' }, async ({ page }) => {
  const home = new HomePage(page);
  await home.open();
  await home.openProductByName(catalog.product);
  await new Navigation(page).home();
  await expect(home.card(catalog.product)).toBeVisible();
});
