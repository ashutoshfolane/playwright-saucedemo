export function makeRunId(): string {
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  return `run-${ts}`;
}
