import type { Page } from "@playwright/test";
import { log } from "../utils/logger";

export abstract class BasePage {
  protected readonly page: Page;
  protected readonly pageName: string;

  constructor(page: Page, pageName: string) {
    this.page = page;
    this.pageName = pageName;
  }

  async goto(path: string) {
    log("goto", { page: this.pageName, path });
    await this.page.goto(path);
  }

  async expectUrlContains(partial: string | RegExp) {
    if (typeof partial === "string") {
      await this.page.waitForURL(`**${partial}**`);
      return;
    }
    await this.page.waitForURL(partial);
  }
}
