import { test } from "../../src/fixtures/test";
import { InventoryPage } from "../../src/pages/InventoryPage";
import { completeCheckout } from "../../src/flows/checkout.flow";
import { expectCheckoutComplete } from "../../src/assertions/checkout.expect";
import { ITEMS } from "../../src/data/factories/constants";

test.use({ auth: true });

test("@smoke @checkout checkout completes", async ({ page, runId }) => {
  const inv = new InventoryPage(page);
  await inv.open();

  await completeCheckout(page, runId, ITEMS.BACKPACK);
  await expectCheckoutComplete(page);
});
