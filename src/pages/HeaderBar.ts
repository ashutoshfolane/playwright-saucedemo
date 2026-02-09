import type { Locator, Page } from "@playwright/test";

export class HeaderBar {
  readonly page: Page;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuButton = page.locator("#react-burger-menu-btn");
    this.logoutLink = page.locator("#logout_sidebar_link");
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
  }

  async openMenu() {
    await this.menuButton.click();
    await this.logoutLink.waitFor({ state: "visible" });
  }

  async logout() {
    await this.openMenu();
    await this.logoutLink.click();
  }

  async goToCart() {
    await this.cartLink.click();
  }
}
