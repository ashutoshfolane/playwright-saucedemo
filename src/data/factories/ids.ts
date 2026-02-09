import crypto from "node:crypto";

const PREFIX = "qaprefix";

export function uniqueId(suffix: string) {
  return `${PREFIX}-${suffix}-${crypto.randomUUID().slice(0, 8)}`;
}
