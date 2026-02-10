import type { Page } from "@playwright/test";
import { InventoryPage } from "../pages/InventoryPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutStepOnePage } from "../pages/CheckoutStepOnePage";
import { CheckoutStepTwoPage } from "../pages/CheckoutStepTwoPage";
import { checkoutUserData } from "../data/factories/checkout.factory";

export async function completeCheckout(page: Page, runId: string, itemName: string) {
  const inv = new InventoryPage(page);
  const cart = new CartPage(page);
  const step1 = new CheckoutStepOnePage(page);
  const step2 = new CheckoutStepTwoPage(page);

  const user = checkoutUserData(runId);

  await inv.addItem(itemName);
  await inv.header.goToCart();

  await cart.checkout();
  await step1.submitShipping(user.firstName, user.lastName, user.postalCode);

  await step2.finish();
}
