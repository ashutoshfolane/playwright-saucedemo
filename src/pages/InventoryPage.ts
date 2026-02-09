import type { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { HeaderBar } from "./HeaderBar";

export class InventoryPage extends BasePage {
  readonly title: Locator;
  readonly sortSelect: Locator;
  readonly header: HeaderBar;

  constructor(page: Page) {
    super(page, "InventoryPage");
    this.title = page.locator('[data-test="title"]');
    this.sortSelect = page.locator('[data-test="product-sort-container"]');
    this.header = new HeaderBar(page);
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
    await this.addButton(itemName).click();
  }

  async removeItem(itemName: string) {
    await this.removeButton(itemName).click();
  }

  async sortBy(value: string) {
    await this.sortSelect.selectOption(value);
  }

  async open() {
    await this.goto("/inventory.html");
  }
}
