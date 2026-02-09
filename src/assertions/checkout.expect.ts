import { expect, type Page } from "@playwright/test";
import { CheckoutCompletePage } from "../pages/CheckoutCompletePage";

export async function expectCheckoutComplete(page: Page) {
  const done = new CheckoutCompletePage(page);
  await expect(done.completeHeader).toHaveText(/Thank you/i);
}
