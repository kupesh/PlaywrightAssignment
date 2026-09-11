import { expect, type Page } from '@playwright/test';
import billing from '../test-data/checkout.json';
export class CheckoutPage {
  constructor(readonly page: Page) {}
  get proceed() { return this.page.getByRole('button', { name: 'Proceed to checkout', exact: true }); }
  get payment() { return this.page.getByRole('combobox', { name: 'Payment Method', exact: true }); }
  get confirmation() { return this.page.getByText(/^Thanks for your order! Your invoice number is/); }
  get guestTab() { return this.page.getByRole('tab', { name: 'Continue as Guest', exact: true }); }
  get guestButton() { return this.page.getByRole('button', { name: 'Continue as Guest', exact: true }); }
  get panel() { return this.page.getByRole('tabpanel'); }
  async billing() {
    const country = this.page.getByRole('combobox', { name: 'Country', exact: true });
    const fields = [
      [this.page.getByLabel('Postal code', { exact: true }), billing.postalCode],
      [this.page.getByTestId('house_number'), billing.houseNumber],
      [this.page.getByLabel('Street', { exact: true }), billing.street],
      [this.page.getByLabel('City', { exact: true }), billing.city],
      [this.page.getByLabel('State', { exact: true }), billing.state],
    ] as const;

    await expect(async () => {
      await country.selectOption({ label: billing.country });

      for (const [field, value] of fields) {
        await field.fill(value);
        await expect(field).toHaveValue(value);
      }

      await expect(this.proceed).toBeEnabled({ timeout: 1_000 });
      await this.proceed.click({ timeout: 1_000 });
      await expect(this.payment).toBeVisible({ timeout: 2_000 });
    }).toPass({ timeout: 15_000 });
  }
async finish() {
  await this.payment.selectOption({
    label: billing.paymentMethod,
  });

  const confirm = this.page.getByTestId('finish');
  const paymentSuccess =
    this.page.getByTestId('payment-success-message');

  // First confirmation: complete synthetic payment.
  await expect(confirm).toBeEnabled({
    timeout: 10_000,
  });

  await confirm.click();

  await expect(paymentSuccess).toHaveText(
    'Payment was successful',
    { timeout: 10_000 },
  );

  // Current test design expects another confirmation
  // before the final invoice/order reference is produced.
  await expect(confirm).toBeEnabled({
    timeout: 10_000,
  });

  await confirm.click();

  // Wait for a reliable invoice indicator to appear. Some runs navigate or
  // update the page state asynchronously; wait for either the invoice text
  // or the confirmation block to become visible to avoid transient races.
  await this.page.waitForSelector('text=/INV-\\d+/', { timeout: 15_000 });

  await expect(this.confirmation).toBeVisible({
    timeout: 5_000,
  });

  const confirmationText =
    await this.confirmation.innerText();

  const invoice =
    confirmationText.match(/INV-\d+/);

  expect(invoice).not.toBeNull();

  return invoice![0];
}
}
