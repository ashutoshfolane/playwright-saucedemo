import { test, expect } from "../../src/fixtures/test";
import { InventoryPage } from "../../src/pages/InventoryPage";
import { CartPage } from "../../src/pages/CartPage";
import { CheckoutStepOnePage } from "../../src/pages/CheckoutStepOnePage";
import { ITEMS, URLS } from "../../src/data/factories/constants";

test.use({ auth: true });

test("@regression @checkout cancel checkout returns to cart", async ({ page }) => {
  const inv = new InventoryPage(page);
  await inv.open();
  await inv.addItem(ITEMS.BACKPACK);
  await inv.header.goToCart();

  const cart = new CartPage(page);
  await cart.checkout();

  const step1 = new CheckoutStepOnePage(page);
  await step1.cancel();

  await expect(page).toHaveURL(URLS.CART);
});
