import { test, expect } from "../../src/fixtures/test";
import { InventoryPage } from "../../src/pages/InventoryPage";

test.use({ auth: true });

test("@regression @auth user can logout", async ({ page }) => {
  const inv = new InventoryPage(page);
  await inv.open();
  await inv.header.logout();
  await expect(page).toHaveURL(/.*saucedemo\.com\/?/);
});
