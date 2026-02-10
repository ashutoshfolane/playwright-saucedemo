import type { Page } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";

export async function uiLogin(page: Page, username: string, password: string) {
  const login = new LoginPage(page);
  const inv = new InventoryPage(page);

  await login.open();
  await login.login(username, password);

  // Wait until we know we're on inventory
  await inv.title.waitFor();
}
