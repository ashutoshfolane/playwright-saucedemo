import { test, expect } from "@playwright/test";

test("@smoke loads saucedemo login page", async ({ page }) => {
  await page.goto("/"); // uses baseURL from env
  await expect(page).toHaveTitle(/Swag Labs/);
  await expect(page.locator(".login_logo")).toHaveText("Swag Labs");
});

test("@regression login page shows expected UI", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Swag Labs/);
  await expect(page.locator(".login_logo")).toHaveText("Swag Labs");

  await expect(page.locator('[data-test="username"]')).toBeVisible();
  await expect(page.locator('[data-test="password"]')).toBeVisible();
  await expect(page.locator('[data-test="login-button"]')).toBeVisible();
});
