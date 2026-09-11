import { test, expect } from '@playwright/test';
import { AuthPage } from '../pages/AuthPage';
import { createUser } from '../test-data/users';

test('AUTH-001 register a disposable synthetic customer', async ({ page }) => {
  const auth = new AuthPage(page);
  const user = createUser();
  await auth.register(user);
  await auth.login(user);
  await auth.assertAccount(user);
});
test('AUTH-002 customer can sign in and sign out', { tag: '@mobile' }, async ({ page }) => {
  const auth = new AuthPage(page);
  const user = createUser();
  await auth.register(user);
  await auth.login(user);
  await auth.assertAccount(user);
  await auth.logout(user);
  await auth.assertProtected();
});
test('AUTH-003 invalid credentials are rejected', async ({ page }) => {
  const auth = new AuthPage(page);
  await auth.openLogin();
  await auth.login(createUser());
  await expect(auth.loginError).toHaveText('Invalid email or password');
  await expect(auth.accountHeading).toHaveCount(0);
  await auth.assertProtected();
});
test('AUTH-004 registration requires mandatory fields', async ({ page }) => {
  const auth = new AuthPage(page);
  await auth.openRegistration();
  await auth.registerButton.click();
  for (const label of ['First name is required', 'Last name is required', 'Email is required', 'Password is required']) {
    await expect(page.getByText(label, { exact: true })).toBeVisible();
  }
  await expect(page).toHaveURL(/\/auth\/register$/);
  await expect(auth.accountHeading).toHaveCount(0);
  await expect(auth.registerButton).toBeVisible();
});
