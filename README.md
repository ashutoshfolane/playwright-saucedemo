````
# Playwright SauceDemo --- Production-Grade UI Automation Framework (TypeScript)

[![UI Smoke](https://github.com/ashutoshfolane/playwright-saucedemo/actions/workflows/ui-smoke.yml/badge.svg)](https://github.com/ashutoshfolane/playwright-saucedemo/actions/workflows/ui-smoke.yml)
[![UI Regression Nightly](https://github.com/ashutoshfolane/playwright-saucedemo/actions/workflows/ui-regression.yml/badge.svg)](https://github.com/ashutoshfolane/playwright-saucedemo/actions/workflows/ui-regression.yml)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)
![Node](https://img.shields.io/badge/node-22.x-blue.svg)
![Playwright](https://img.shields.io/badge/playwright-test-informational)

A professional Playwright + TypeScript UI automation framework designed like a real production repo: **clean layering**, **typed env config**, **fast auth via storageState**, **CI quality gates**, **nightly sharded regression with a single merged report**, and **safe manual runs across environments**.

---

## Architecture Overview

This framework is intentionally layered so tests stay readable and changes are isolated:

1. **Tests (`tests/`)** --- Business-facing specs grouped by domain (auth/inventory/cart/checkout). Tests avoid UI plumbing and read like requirements.
2. **Flows (`src/flows/`)** --- Reusable business actions such as `uiLogin()` and `completeCheckout()` to reduce duplication and make tests concise.
3. **Pages (`src/pages/`)** --- Page Objects own locators and UI operations. When selectors change, you fix them in one place.
4. **Assertions (`src/assertions/`)** --- Stable reusable expectations (ex: `expectOnInventory`, `expectCartBadge`) so tests don't repeat assertion logic.
5. **Data factories (`src/data/factories/`)** --- Central constants and test-data generation (items/users/checkout payloads/unique ids).
6. **Fixtures (`src/fixtures/test.ts`)** --- Shared setup: per-test `runId`, structured logging, isolated browser contexts, and optional authenticated state via `storageState`.
7. **Env config (`src/config/env.ts`)** --- Typed env loader (`dotenv + zod`) with a **default of staging**, supporting both local `.env` files and CI secret injection.

---

## Tech Stack

- **Test Runner**: Playwright Test
- **Language**: TypeScript (Node 22)
- **Config**: `dotenv` + `zod` validation
- **Code Quality**: ESLint (flat config) + Prettier + Husky + lint-staged
- **CI**: GitHub Actions
  - Smoke on PR/push (staging)
  - Nightly sharded regression + merged HTML report (staging)
  - Manual custom workflow (dev/staging/prod) with safety guards

---

## Repository Layout

```text
playwright-saucedemo/
  src/
    config/
      env.ts
    fixtures/
      test.ts
    utils/
      runId.ts
      redact.ts
      logger.ts
    data/
      factories/
        constants.ts
        users.ts
        ids.ts
        checkout.factory.ts
    pages/
      BasePage.ts
      HeaderBar.ts
      LoginPage.ts
      InventoryPage.ts
      CartPage.ts
      CheckoutStepOnePage.ts
      CheckoutStepTwoPage.ts
      CheckoutCompletePage.ts
    flows/
      auth.flow.ts
      checkout.flow.ts
    assertions/
      auth.expect.ts
      inventory.expect.ts
      cart.expect.ts
      checkout.expect.ts

  tests/
    auth/
      login.users.spec.ts
      login.negative.spec.ts
      logout.spec.ts
    inventory/
      inventory.sorting.spec.ts
      inventory.add_remove.spec.ts
    cart/
      cart.badge_and_remove.spec.ts
    checkout/
      checkout.happy.spec.ts
      checkout.validation.spec.ts
      checkout.cancel.spec.ts

  scripts/
    auth-generate-state.ts

  env/                     # local only (gitignored), except env/.env.example
    .env.example
    .env.dev
    .env.staging
    .env.production

  storageState/            # generated auth state (gitignored)
  .github/workflows/
    ui-smoke.yml
    ui-regression.yml
    ui-custom.yml

  playwright.config.ts
  tsconfig.json
  eslint.config.mjs
  .prettierrc
  .prettierignore
  package.json
````

---

## **Environment Model (Production-Style)**

### **Local**

- You keep local env files in env/ (not committed):
  - env/.env.dev

  - env/.env.staging

  - env/.env.production

### **Committed Example**

Only env/.env.example is committed.

Example:

```
ENV=staging
BASE_URL=https://www.saucedemo.com
SAUCE_USERNAME=standard_user
SAUCE_PASSWORD=secret_sauce
```

### **CI**

CI uses **GitHub Environments** (not .env files):

- Environment vars: BASE_URL

- Environment secrets: SAUCE_USERNAME, SAUCE_PASSWORD

Your src/config/env.ts loads from:

- local env file if present (env/.env.<ENV>)

- otherwise uses process.env (CI injection)

---

## **Auth Strategy (Fast + Deterministic)**

For tests that require auth, we use Playwright storageState.

### **Generate storageState**

```
npm run auth:state
```

This writes:

```
storageState/standard_user.json
```

### **Use it in tests**

```
test.use({ auth: true });
```

Your fixture enforces **fail-fast**:

- If a test requests auth: true but storageState is missing, it errors with a clear fix:
  - Local: run npm run auth:state

  - CI: run npm run auth:state before the suite

---

## **Local Setup**

### **1) Install**

```
npm ci
npx playwright install
```

### **2) Add local env file**

```
cp env/.env.example env/.env.staging
# edit SAUCE_USERNAME / SAUCE_PASSWORD if needed
```

### **3) Generate auth state**

```
npm run auth:state
```

---

## **Commands (package.json)**

### **Run tests**

```
npm run test:smoke
npm run test:regression
npm run test:headed
npm run test:ui
npm run test:debug
```

### **Sharding (useful for CI)**

```
SHARD=1/3 npm run test:regression:shard:blob
SHARD=2/3 npm run test:regression:shard:blob
SHARD=3/3 npm run test:regression:shard:blob
npm run report:merge:html
```

### **Quality**

```
npm run lint
npm run lint:fix
npm run lint:strict
npm run format
npm run format:write
npm run typecheck
```

---

## **CI Workflows**

### **UI Smoke (**

### **ui-smoke.yml**

### **)**

- Triggers: PR + push (main/master) + manual

- Environment: **staging**

- Steps:
  - install deps

  - install browsers

  - lint:strict

  - auth:state

  - test:smoke

  - upload artifacts: report + test-results

### **UI Regression Nightly (**

### **ui-regression.yml**

### **)**

- Triggers: nightly schedule + manual

- Environment: **staging**

- Runs regression in **3 shards** with blob reporter

- Downloads shard blobs and merges into **one HTML report**

- Uploads a single merged report artifact

### **UI Custom (**

### **ui-custom.yml**

### **)**

- Manual only

- Choose:
  - environment: dev/staging/production

  - browser: chromium/firefox/webkit

  - selection: **testPath OR tags**

- Guardrails:
  - cannot run full suite

  - **production requires testPath** (tags are blocked)

---

## **Code Quality & PR Gates**

### **Local (pre-commit)**

- Husky + lint-staged ensure:
  - ESLint fixes

  - Prettier formatting

- This keeps PRs clean and prevents style drift.

### **CI gate**

- npm run lint:strict fails on warnings

- Smoke suite validates PRs quickly

- Artifacts always uploaded to debug failures.

---

## **Design Principles Used**

- **Single Responsibility**: pages own locators, flows own business logic, tests own intent

- **Stable Assertions**: centralized in src/assertions/

- **No Secrets in Git**: GitHub Environments store credentials

- **Fast CI**: auth storageState + sharding + merged reports

- **Safe Manual Runs**: enforce selectors + production restrictions

---

## **Troubleshooting**

### **Smoke/regression fails with "redirected to login"**

- Ensure auth state exists:

```
npm run auth:state
```

- Ensure BASE_URL is set correctly for the selected environment.

### **View traces and reports**

```
npm run report
# or for a trace zip:
npx playwright show-trace test-results/**/trace.zip
```

---

## **License**

MIT — see `LICENSE`.
