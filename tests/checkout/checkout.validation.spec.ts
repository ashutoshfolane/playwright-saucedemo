import { test, expect } from "../../src/fixtures/test";
import { InventoryPage } from "../../src/pages/InventoryPage";
import { CartPage } from "../../src/pages/CartPage";
import { CheckoutStepOnePage } from "../../src/pages/CheckoutStepOnePage";
import { ITEMS } from "../../src/data/factories/constants";
import { CHECKOUT_TEST_DATA } from "../../src/data/factories/checkout.testdata";

test.use({ auth: true });

test("@regression @checkout checkout requires first name", async ({ page }) => {
  const inv = new InventoryPage(page);
  await inv.open();
  await inv.addItem(ITEMS.BACKPACK);
  await inv.header.goToCart();

  const cart = new CartPage(page);
  await cart.checkout();

  const step1 = new CheckoutStepOnePage(page);
  await step1.submitShipping("", CHECKOUT_TEST_DATA.LAST_NAME, CHECKOUT_TEST_DATA.POSTAL_CODE);
  await expect(step1.error).toBeVisible();
});

test("@regression @checkout checkout requires last name", async ({ page }) => {
  const inv = new InventoryPage(page);
  await inv.open();
  await inv.addItem(ITEMS.BACKPACK);
  await inv.header.goToCart();

  const cart = new CartPage(page);
  await cart.checkout();

  const step1 = new CheckoutStepOnePage(page);
  await step1.submitShipping(CHECKOUT_TEST_DATA.FIRST_NAME, "", CHECKOUT_TEST_DATA.POSTAL_CODE);
  await expect(step1.error).toBeVisible();
});

test("@regression @checkout checkout requires postal code", async ({ page }) => {
  const inv = new InventoryPage(page);
  await inv.open();
  await inv.addItem(ITEMS.BACKPACK);
  await inv.header.goToCart();

  const cart = new CartPage(page);
  await cart.checkout();

  const step1 = new CheckoutStepOnePage(page);
  await step1.submitShipping(CHECKOUT_TEST_DATA.FIRST_NAME, CHECKOUT_TEST_DATA.LAST_NAME, "");
  await expect(step1.error).toBeVisible();
});
