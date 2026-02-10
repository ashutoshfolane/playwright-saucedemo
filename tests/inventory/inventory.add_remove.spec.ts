import { test } from "../../src/fixtures/test";
import { InventoryPage } from "../../src/pages/InventoryPage";
import { expectCartBadge } from "../../src/assertions/cart.expect";
import { ITEMS } from "../../src/data/factories/constants";

test.use({ auth: true });

test("@smoke @inventory add then remove item from inventory", async ({ page }) => {
  const inv = new InventoryPage(page);
  await inv.open();

  await inv.addItem(ITEMS.BACKPACK);
  await expectCartBadge(page, 1);

  await inv.removeItem(ITEMS.BACKPACK);
  await expectCartBadge(page, 0);
});
