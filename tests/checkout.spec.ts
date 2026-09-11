import { test, expect } from '../fixtures/test';
import { AuthPage } from '../pages/AuthPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { createUser } from '../test-data/users';
import catalog from '../test-data/catalog.json';

test('CHK-001 guest checkout requires customer identity', { tag: '@mobile' }, async ({ cart, page }) => {
  const checkout = new CheckoutPage(page);
  await cart.page.proceed.click();
  await expect(page.getByRole('heading', { name: 'Login', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Register your account', exact: true })).toBeVisible();
  await checkout.guestTab.click();
  await checkout.guestButton.click();
  for (const message of ['Email is required', 'First name is required', 'Last name is required']) {
    await expect(checkout.panel.getByText(message, { exact: true })).toBeVisible();
  }
  await expect(checkout.payment).not.toBeVisible();
  await expect(checkout.confirmation).toHaveCount(0);
  await page.reload();
  await cart.page.assertItem(catalog.product, cart.price, 1);
});
test(
  'CHK-002 customer completes a synthetic checkout',
  { tag: '@mobile' },
  async ({ cart, page }) => {
    test.setTimeout(100_000);

    const user = createUser();
    const auth = new AuthPage(page);

    await test.step('Register and authenticate customer', async () => {
      await auth.register(user);
      await auth.login(user);
      await auth.assertAccount(user);
    });

    await test.step('Verify cart and begin checkout', async () => {
      await page.goto('/checkout', {
        waitUntil: 'domcontentloaded',
      });

      await cart.page.assertItem(
        catalog.product,
        cart.price,
        1,
      );

      const checkout = new CheckoutPage(page);

      await checkout.proceed.click();

      await expect(
        page.getByText(/you are already logged in/i),
      ).toBeVisible();

      await checkout.proceed.click();
    });

    const checkout = new CheckoutPage(page);

    await test.step('Complete billing details', async () => {
      await checkout.billing();
    });

    await test.step('Complete payment and verify order', async () => {
      const reference = await checkout.finish();

      expect(reference).toMatch(/INV-\d+/);
    });
  },
);
