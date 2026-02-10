import { test, expect } from "../../src/fixtures/test";
import { env } from "../../src/config/env";
import { sauceUsers } from "../../src/data/factories/users";
import { ERRORS } from "../../src/data/factories/constants";
import { expectOnInventory } from "../../src/assertions/inventory.expect";
import { expectLoginErrorContains } from "../../src/assertions/auth.expect";
import { uiLogin } from "../../src/flows/auth.flow";
import { LoginPage } from "../../src/pages/LoginPage";
import { InventoryPage } from "../../src/pages/InventoryPage";

test("@smoke @auth standard_user can login", async ({ page }) => {
  await uiLogin(page, sauceUsers.standard_user, env.SAUCE_PASSWORD);
  await expectOnInventory(page);
});

test("@regression @auth locked_out_user cannot login", async ({ page }) => {
  const login = new LoginPage(page);
  await login.open();
  await login.login(sauceUsers.locked_out_user, env.SAUCE_PASSWORD);
  await expectLoginErrorContains(page, ERRORS.LOCKED_OUT);
});

test("@regression @auth problem_user can login", async ({ page }) => {
  await uiLogin(page, sauceUsers.problem_user, env.SAUCE_PASSWORD);
  await expectOnInventory(page);
});

test("@regression @auth performance_glitch_user can login (slower)", async ({ page }) => {
  const start = Date.now();

  await uiLogin(page, sauceUsers.performance_glitch_user, env.SAUCE_PASSWORD);

  const inv = new InventoryPage(page);
  await expect(inv.title).toBeVisible();

  const ms = Date.now() - start;
  expect(ms).toBeLessThan(15_000);
});

test("@regression @auth error_user can login", async ({ page }) => {
  await uiLogin(page, sauceUsers.error_user, env.SAUCE_PASSWORD);
  await expectOnInventory(page);
});

test("@regression @auth visual_user can login", async ({ page }) => {
  await uiLogin(page, sauceUsers.visual_user, env.SAUCE_PASSWORD);
  await expectOnInventory(page);
});
