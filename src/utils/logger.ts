import { redactObject } from "./redact";

export function log(message: string, meta?: Record<string, unknown>) {
  const safe = meta ? redactObject(meta) : undefined;
  const ts = new Date().toISOString();
  const line = safe ? `${message} ${JSON.stringify(safe)}` : message;

  console.log(`[ui][${ts}] ${line}`);
}
