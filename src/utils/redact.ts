const SECRET_KEYS = ["PASSWORD", "TOKEN", "SECRET", "KEY"];

function isSecretKey(key: string): boolean {
  const upper = key.toUpperCase();
  return SECRET_KEYS.some((s) => upper.includes(s));
}

export function redactObject(obj: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (isSecretKey(k)) {
      out[k] = "***REDACTED***";
      continue;
    }
    // redact nested objects (but keep arrays as-is unless you want deeper handling)
    if (v && typeof v === "object" && !Array.isArray(v)) {
      out[k] = redactObject(v as Record<string, unknown>);
    } else {
      out[k] = v;
    }
  }
  return out;
}
