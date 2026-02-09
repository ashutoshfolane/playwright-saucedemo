import type { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { HeaderBar } from "./HeaderBar";

export class CartPage extends BasePage {
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly header: HeaderBar;

  constructor(page: Page) {
    super(page, "CartPage");
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.header = new HeaderBar(page);
  }

  cartItem(name: string) {
    return this.page.locator(".cart_item").filter({ hasText: name });
  }

  removeButton(name: string) {
    return this.cartItem(name).locator("button:has-text('Remove')");
  }

  async removeItem(name: string) {
    await this.removeButton(name).click();
  }

  async checkout() {
    await this.checkoutButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }
}
