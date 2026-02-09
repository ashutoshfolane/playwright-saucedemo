import { expect, type Page } from "@playwright/test";
import { InventoryPage } from "../pages/InventoryPage";

export async function expectOnInventory(page: Page) {
  const inv = new InventoryPage(page);
  await expect(inv.title).toHaveText("Products");
  await inv.expectUrlContains("/inventory.html");
}
