import { test as base, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { makeRunId } from "../utils/runId";
import { log } from "../utils/logger";
import { env } from "../config/env";

type Fixtures = {
  runId: string;
  auth: boolean;
};

export const test = base.extend<Fixtures>({
  runId: async ({}, use, testInfo) => {
    const id = makeRunId();
    log("test start", { runId: id, test: testInfo.title });

    await use(id);

    log("test end", { runId: id, test: testInfo.title, status: testInfo.status });
  },

  // option fixture: tests can opt-in using test.use({ auth: true })
  auth: [false, { option: true }],

  // override context to optionally load storageState (when auth=true)
  context: async ({ browser, auth }, use, testInfo) => {
    const statePath = path.resolve(process.cwd(), "storageState", "standard_user.json");
    const hasState = fs.existsSync(statePath);

    // Fail fast: if a test opted into auth, require storageState to exist
    if (auth && !hasState) {
      throw new Error(
        `Test "${testInfo.title}" requested auth=true, but storageState was not found.\n` +
          `Missing: ${statePath}\n\n` +
          `Fix:\n` +
          `  - Local: npm run auth:state\n` +
          `  - CI: add "npm run auth:state" before running tests\n`,
      );
    }

    if (!auth && hasState) {
      log("storageState present (auth disabled)", { test: testInfo.title });
    }

    const context = await browser.newContext({
      baseURL: env.BASE_URL,
      storageState: auth ? statePath : undefined,
    });

    log("context created", { test: testInfo.title, auth, hasState });

    try {
      await use(context);
    } finally {
      await context.close();
    }
  },
});

export { expect };
