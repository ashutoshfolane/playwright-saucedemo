import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import { z } from "zod";

/**
 * Default environment is staging.
 * - Local: loads env/.env.<ENV> if present
 * - CI: relies on process.env injected by workflow (secrets)
 */
const DEFAULT_ENV = "staging";
const resolvedEnv = process.env.ENV ?? DEFAULT_ENV;

const envFilePath = path.resolve(process.cwd(), "env", `.env.${resolvedEnv}`);

// Load local env file if it exists (dev workflow). If not, assume CI env injection.
if (fs.existsSync(envFilePath)) {
  dotenv.config({ path: envFilePath, override: false });
} else if (!process.env.CI) {
  // Helpful hint for local dev
  console.warn(
    `⚠️ Env file not found: ${envFilePath}. Create it (e.g. cp env/.env.example env/.env.${resolvedEnv}) or set variables in your shell.`,
  );
}

const schema = z.object({
  ENV: z.string().default(DEFAULT_ENV),
  BASE_URL: z.url(),
  SAUCE_USERNAME: z.string().min(1),
  SAUCE_PASSWORD: z.string().min(1),
});

export const env = schema.parse({
  ENV: process.env.ENV ?? DEFAULT_ENV,
  BASE_URL: process.env.BASE_URL,
  SAUCE_USERNAME: process.env.SAUCE_USERNAME,
  SAUCE_PASSWORD: process.env.SAUCE_PASSWORD,
});
