/**
 * Push run-level metrics to Grafana Cloud OTLP HTTP Metrics endpoint.
 * Uses OTLP/JSON payload.
 *
 * Required env:
 *  - GRAFANA_OTLP_METRICS_URL
 *  - GRAFANA_OTLP_USERNAME
 *  - GRAFANA_OTLP_TOKEN
 *  - METRIC_STATUS
 *  - METRIC_DURATION_SECONDS
 *  - METRIC_REPO, METRIC_WORKFLOW, METRIC_BRANCH, METRIC_RUN_ID, METRIC_RUN_ATTEMPT, METRIC_SHA
 */

type EnvKey =
  | "GRAFANA_OTLP_METRICS_URL"
  | "GRAFANA_OTLP_USERNAME"
  | "GRAFANA_OTLP_TOKEN"
  | "METRIC_STATUS"
  | "METRIC_DURATION_SECONDS"
  | "METRIC_REPO"
  | "METRIC_WORKFLOW"
  | "METRIC_BRANCH"
  | "METRIC_RUN_ID"
  | "METRIC_RUN_ATTEMPT"
  | "METRIC_SHA";

function required(name: EnvKey): string {
  const v = process.env[name];
  if (!v || String(v).trim().length === 0) throw new Error(`Missing env: ${name}`);
  return v;
}

function normalizeStatus(raw: string): string {
  const s = (raw || "").trim().toLowerCase();
  if (!s) return "unknown";
  // GitHub run conclusions typically include: success, failure, cancelled, skipped, timed_out, action_required, stale, neutral
  return s;
}

async function main(): Promise<void> {
  const url = required("GRAFANA_OTLP_METRICS_URL");
  const user = required("GRAFANA_OTLP_USERNAME");
  const token = required("GRAFANA_OTLP_TOKEN");

  const status = normalizeStatus(required("METRIC_STATUS"));
  const durationSeconds = Number(process.env.METRIC_DURATION_SECONDS ?? "0");

  const repo = required("METRIC_REPO");
  const workflow = required("METRIC_WORKFLOW");
  const branch = required("METRIC_BRANCH");
  const runId = required("METRIC_RUN_ID");
  const runAttempt = required("METRIC_RUN_ATTEMPT");
  const sha = required("METRIC_SHA");

  const nowMs = Date.now();
  const nowNs = String(nowMs * 1_000_000);

  // Low-cardinality labels (good for dashboards)
  const attrs = [
    { key: "repo", value: { stringValue: repo } },
    { key: "workflow", value: { stringValue: workflow } },
    { key: "branch", value: { stringValue: branch } },
    { key: "status", value: { stringValue: status } },
  ];

  // High-cardinality identifiers (use sparingly in dashboards; useful for drill-down)
  const runAttrs = [
    { key: "run_id", value: { stringValue: String(runId) } },
    { key: "run_attempt", value: { stringValue: String(runAttempt) } },
    { key: "sha", value: { stringValue: String(sha) } },
  ];

  const payload = {
    resourceMetrics: [
      {
        resource: {
          attributes: [
            { key: "service.name", value: { stringValue: "playwright-ui-regression" } },
            { key: "ci.provider", value: { stringValue: "github_actions" } },
          ],
        },
        scopeMetrics: [
          {
            scope: { name: "ui-regression", version: "1.0.0" },
            metrics: [
              {
                name: "ui_regression_run_total",
                description: "Count of UI regression workflow runs (event-style)",
                unit: "1",
                sum: {
                  // DELTA is best for "1 per event"; but many backends accept DELTA or CUMULATIVE.
                  // We'll keep CUMULATIVE temporality but NON-monotonic so "1 per run" is valid.
                  aggregationTemporality: 2, // CUMULATIVE
                  isMonotonic: false,
                  dataPoints: [
                    {
                      startTimeUnixNano: nowNs,
                      timeUnixNano: nowNs,
                      asInt: 1,
                      attributes: [...attrs, ...runAttrs],
                    },
                  ],
                },
              },
              {
                name: "ui_regression_run_duration_seconds",
                description: "Duration of UI regression workflow run in seconds",
                unit: "s",
                gauge: {
                  dataPoints: [
                    {
                      timeUnixNano: nowNs,
                      asDouble: Number.isFinite(durationSeconds) ? durationSeconds : 0,
                      attributes: [...attrs, ...runAttrs],
                    },
                  ],
                },
              },
              {
                name: "ui_regression_run_success",
                description: "1 if run succeeded, else 0",
                unit: "1",
                gauge: {
                  dataPoints: [
                    {
                      timeUnixNano: nowNs,
                      asInt: status === "success" ? 1 : 0,
                      attributes: [...attrs, ...runAttrs],
                    },
                  ],
                },
              },
            ],
          },
        ],
      },
    ],
  };

  const basic = Buffer.from(`${user}:${token}`).toString("base64");

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${basic}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Grafana OTLP push failed: ${res.status} ${res.statusText}\n${text}`);
  }

  // No secrets printed
  console.log("Pushed run-level metrics to Grafana Cloud");
}

main().catch((e) => {
  console.error(`❌ ${e instanceof Error ? e.message : String(e)}`);
  process.exit(1);
});
