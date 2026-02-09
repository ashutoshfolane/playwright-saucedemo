import { expect, type Page } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

export async function expectLoginErrorContains(page: Page, text: string) {
  const login = new LoginPage(page);
  await expect(login.error).toContainText(text);
}
