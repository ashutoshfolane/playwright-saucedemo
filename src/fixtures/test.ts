import { test as base, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { makeRunId } from "../utils/runId";
import { log } from "../utils/logger";

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

    const context = await browser.newContext({
      storageState: auth && hasState ? statePath : undefined,
    });

    log("context created", { test: testInfo.title, auth, hasState });

    await use(context);
    await context.close();
  },
});

export { expect };
