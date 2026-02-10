import { test, expect } from "../../src/fixtures/test";
import { InventoryPage } from "../../src/pages/InventoryPage";
import { CartPage } from "../../src/pages/CartPage";
import { expectCartBadge } from "../../src/assertions/cart.expect";
import { ITEMS } from "../../src/data/factories/constants";

test.use({ auth: true });

test("@regression @cart add item, see in cart, remove in cart", async ({ page }) => {
  const inv = new InventoryPage(page);
  await inv.open();

  await inv.addItem(ITEMS.BACKPACK);
  await expectCartBadge(page, 1);

  await inv.header.goToCart();
  const cart = new CartPage(page);
  await expect(cart.cartItem(ITEMS.BACKPACK)).toBeVisible();

  await cart.removeItem(ITEMS.BACKPACK);
  await expectCartBadge(page, 0);
});
