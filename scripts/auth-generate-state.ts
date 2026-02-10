import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { env } from "../src/config/env";

async function main() {
  const storageDir = path.resolve(process.cwd(), "storageState");
  const storagePath = path.join(storageDir, "standard_user.json");

  fs.mkdirSync(storageDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ baseURL: env.BASE_URL });
  const page = await context.newPage();

  await page.goto("/");

  await page.locator('[data-test="username"]').fill(env.SAUCE_USERNAME);
  await page.locator('[data-test="password"]').fill(env.SAUCE_PASSWORD);
  await page.locator('[data-test="login-button"]').click();

  await page.waitForURL("**/inventory.html");

  await context.storageState({ path: storagePath });

  await context.close();
  await browser.close();

  console.log(`✅ storageState saved: ${storagePath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
