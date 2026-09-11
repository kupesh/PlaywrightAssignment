import { expect, type Page } from '@playwright/test';
import { Navigation } from './Navigation';
import type { SyntheticUser } from '../test-data/users';
export class AuthPage {
  constructor(readonly page: Page) {}
  get loginHeading() { return this.page.getByRole('heading', { name: 'Login', exact: true }); }
  get accountHeading() { return this.page.getByRole('heading', { name: 'My account', exact: true }); }
  get registerButton() { return this.page.getByRole('button', { name: 'Register', exact: true }); }
  get loginError() { return this.page.getByTestId('login-error'); }
  field(name: string) { return this.page.getByLabel(name, { exact: true }); }
  async openLogin() {
    // Use DOMContentLoaded to avoid third-party analytics and redirect traffic delaying
    // the browser 'load' event after the login form is already usable.
    await this.page.goto('/auth/login', { waitUntil: 'domcontentloaded', timeout: 30_000 });
    await expect(this.loginHeading).toBeVisible({ timeout: 10_000 });
  }
  async openRegistration() {
    await this.openLogin();
    await this.page.getByRole('link', { name: 'Register your account', exact: true }).click();
    await expect(this.registerButton).toBeVisible();
  }
  async register(user: SyntheticUser) {
    await this.openRegistration();
    await this.field('First name').fill(user.firstName);
    await this.field('Last name').fill(user.lastName);
    await this.field('Date of Birth *').fill(user.birthDate);
    const country = this.page.getByRole('combobox', { name: 'Country', exact: true });

    const address = [
      ['Postal code', user.postalCode],
      ['House number', user.houseNumber],
      ['Street', user.street],
      ['City', user.city],
      ['State', user.state],
    ] as const;

    await expect(async () => {
      await country.selectOption({ label: user.country });
      for (const [label, value] of address) {
        await this.field(label).fill(value);
        await expect(this.field(label)).toHaveValue(value);
      }
    }).toPass({ timeout: 15_000 });

    await this.field('Phone').fill(user.phone);
    await this.field('Email address').fill(user.email);
    await this.field('Password').fill(user.password);

    await this.registerButton.click();
    await expect(this.loginHeading).toBeVisible();
    await expect(this.page).toHaveURL(/\/auth\/login$/);
  }
  async login(user: SyntheticUser) {
    await this.field('Email address *').fill(user.email);
    await this.field('Password *').fill(user.password);
    await this.page.getByRole('button', { name: 'Login', exact: true }).click();
  }
  async assertAccount(user: SyntheticUser) {
    await expect(this.accountHeading).toBeVisible();
    await expect(this.page).toHaveURL(/\/account$/);
    await new Navigation(this.page).openMenu();
    await expect(this.page.getByRole('button', { name: `${user.firstName} ${user.lastName}`, exact: true })).toBeVisible();
  }
  async logout(user: SyntheticUser) {
    await new Navigation(this.page).openMenu();
    await this.page.getByRole('button', { name: `${user.firstName} ${user.lastName}`, exact: true }).click();
    await this.page.getByText('Sign out', { exact: true }).click();
    await expect(this.loginHeading).toBeVisible();
  }
  async assertProtected() {
    await this.page.goto('/account');
    await expect(this.loginHeading).toBeVisible();
    await expect(this.page).toHaveURL(/\/auth\/login$/);
    await expect(this.accountHeading).toHaveCount(0);
  }
}
