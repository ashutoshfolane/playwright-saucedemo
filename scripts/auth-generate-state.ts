import { chromium, expect } from "@playwright/test";
import { env } from "../src/config/env";
import fs from "node:fs";
import path from "node:path";

async function main() {
  const browser = await chromium.launch({ headless: true });

  const context = await browser.newContext({
    baseURL: env.BASE_URL, // must match the app origin used in tests
  });

  const page = await context.newPage();

  // Ensure folder exists
  const outDir = path.resolve(process.cwd(), "storageState");
  fs.mkdirSync(outDir, { recursive: true });

  // Login
  await page.goto("/");
  await page.locator('[data-test="username"]').fill(env.SAUCE_USERNAME);
  await page.locator('[data-test="password"]').fill(env.SAUCE_PASSWORD);
  await page.locator('[data-test="login-button"]').click();

  // Verify auth actually succeeded (critical)
  await page.waitForURL("**/inventory.html");
  await expect(page.locator('[data-test="title"]')).toHaveText("Products");

  // Save state
  const statePath = path.resolve(outDir, "standard_user.json");
  await context.storageState({ path: statePath });

  await browser.close();
   
  console.log(`storageState saved: ${statePath}`);
}

main().catch((e) => {
   
  console.error(e);
  process.exit(1);
});