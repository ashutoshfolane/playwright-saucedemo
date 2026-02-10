import { test } from "../../src/fixtures/test";
import { env } from "../../src/config/env";
import { LoginPage } from "../../src/pages/LoginPage";
import { ERRORS, INVALID_CREDS } from "../../src/data/factories/constants";
import { expectLoginErrorContains } from "../../src/assertions/auth.expect";

test("@regression @auth missing username shows error", async ({ page }) => {
  const login = new LoginPage(page);
  await login.open();
  await login.login("", env.SAUCE_PASSWORD);
  await expectLoginErrorContains(page, ERRORS.USERNAME_REQUIRED);
});

test("@regression @auth missing password shows error", async ({ page }) => {
  const login = new LoginPage(page);
  await login.open();
  await login.login(env.SAUCE_USERNAME, "");
  await expectLoginErrorContains(page, ERRORS.PASSWORD_REQUIRED);
});

test("@regression @auth invalid user shows mismatch error", async ({ page }) => {
  const login = new LoginPage(page);
  await login.open();
  await login.login(INVALID_CREDS.USERNAME, INVALID_CREDS.PASSWORD);
  await expectLoginErrorContains(page, ERRORS.USERNAME_PASSWORD_MISMATCH);
});
