import { expect, type Page } from "@playwright/test";
import { HeaderBar } from "../pages/HeaderBar";

export async function expectCartBadge(page: Page, count: number) {
  const header = new HeaderBar(page);

  if (count === 0) {
    await expect(header.cartBadge).toHaveCount(0);
  } else {
    await expect(header.cartBadge).toHaveText(String(count));
  }
}
