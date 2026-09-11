import { expect, type Page } from '@playwright/test';
import catalog from '../test-data/catalog.json';
export class HomePage {
  constructor(readonly page: Page) {}
  get searchInput() { return this.page.getByRole('textbox', { name: 'Search', exact: true }); }
  get resetButton() { return this.page.getByRole('button', { name: 'X', exact: true }); }
  get names() { return this.page.getByTestId('product-name'); }
  get prices() { return this.page.getByTestId('product-price'); }
  get noResults() { return this.page.getByTestId('no-results'); }
  get searchTerm() { return this.page.getByTestId('search-term'); }
  card(name: string) { return this.page.getByRole('link').filter({ has: this.page.getByRole('heading', { name, exact: true }) }); }
  category(name: string) { return this.page.getByRole('checkbox', { name, exact: true }); }
  async open() {
    await this.page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30_000 });
    await expect(this.card(catalog.product)).toBeVisible();
  }
  // QUERY responses carry JSON; wait for their rendered names to exclude stale lists.
  async update(action: () => Promise<unknown>, path = '/products') {
    const pending = this.page.waitForResponse(r => new URL(r.url()).pathname === path && r.request().method() !== 'OPTIONS');
    await action();
    const response = await pending;
    expect(response.ok(), `Catalog response ${response.status()}`).toBeTruthy();
    const body = await response.json() as { data: { name: string; category: { name: string } }[] };
    await expect(this.names).toHaveText(body.data.map(p => p.name));
    return body.data;
  }
  async searchBy(term: string) {
    await this.searchInput.fill(term);
    await this.update(() => this.page.getByRole('button', { name: 'Search', exact: true }).click(), '/products/search');
  }
  async clearSearch() { await this.update(() => this.resetButton.click()); }
  async filterBy(name: string) { return this.update(() => this.category(name).check()); }
  async sortBy(label: string) { await this.update(() => this.page.getByRole('combobox', { name: 'sort', exact: true }).selectOption({ label })); }
  async openProductByName(name: string) {
    await this.card(name).click();
    await expect(this.page.getByRole('heading', { name, exact: true, level: 1 })).toBeVisible();
  }
}
