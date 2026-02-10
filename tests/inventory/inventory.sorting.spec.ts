import { test, expect } from "../../src/fixtures/test";
import { InventoryPage } from "../../src/pages/InventoryPage";
import { SORT_VALUES } from "../../src/data/factories/sort";

test.use({ auth: true });

test("@regression @inventory can sort products Z->A", async ({ page }) => {
  const inv = new InventoryPage(page);
  await inv.open();
  await inv.sortBy(SORT_VALUES.NAME_Z_TO_A);

  const names = page.locator(".inventory_item_name");
  const count = await names.count();

  const actual: string[] = [];
  for (let i = 0; i < count; i++) {
    actual.push(await names.nth(i).innerText());
  }

  const expected = [...actual].sort((a, b) => b.localeCompare(a));
  expect(actual).toEqual(expected);
});

test("@regression @inventory can sort products low->high", async ({ page }) => {
  const inv = new InventoryPage(page);
  await inv.open();
  await inv.sortBy(SORT_VALUES.PRICE_LOW_TO_HIGH);

  const prices = page.locator(".inventory_item_price");
  const count = await prices.count();

  const actual: number[] = [];
  for (let i = 0; i < count; i++) {
    const txt = await prices.nth(i).innerText();
    actual.push(Number(txt.replace("$", "")));
  }

  const expected = [...actual].sort((a, b) => a - b);
  expect(actual).toEqual(expected);
});
