import type { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { HeaderBar } from "./HeaderBar";

export class InventoryPage extends BasePage {
  readonly title: Locator;
  readonly sortSelect: Locator;
  readonly header: HeaderBar;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page, "InventoryPage");
    this.title = page.locator('[data-test="title"]');
    this.sortSelect = page.locator('[data-test="product-sort-container"]');
    this.header = new HeaderBar(page);
    this.loginButton = page.locator('[data-test="login-button"]');
  }

  itemCard(itemName: string) {
    return this.page.locator(".inventory_item").filter({ hasText: itemName });
  }

  addButton(itemName: string) {
    return this.itemCard(itemName).locator("button:has-text('Add to cart')");
  }

  removeButton(itemName: string) {
    return this.itemCard(itemName).locator("button:has-text('Remove')");
  }

  async addItem(itemName: string) {
    await this.ensureReady();
    await this.addButton(itemName).click();
  }

  async removeItem(itemName: string) {
    await this.ensureReady();
    await this.removeButton(itemName).click();
  }

  async sortBy(value: string) {
    await this.ensureReady();
    await this.sortSelect.selectOption(value);
  }

  async open() {
    await this.goto("/inventory.html");
    await this.ensureReady();
  }

  /**
   * Ensures we're actually on Inventory (and not redirected to Login),
   * and that the inventory UI is ready for interactions.
   */
  private async ensureReady() {
    // If auth state didn't apply, SauceDemo redirects to login.
    if (await this.loginButton.isVisible().catch(() => false)) {
      throw new Error(
        "Expected to be authenticated, but was redirected to the Login page. " +
          "Ensure storageState exists (npm run auth:state) and baseURL is configured.",
      );
    }

    await this.title.waitFor();
    await this.expectUrlContains("/inventory.html");
  }
}
