import assert from "node:assert/strict";

const webUrl =
  process.env.SMOKE_WEB_URL ?? `http://127.0.0.1:${process.env.PORT ?? 3000}`;
const agentUrl =
  process.env.SMOKE_AGENT_URL ??
  `http://127.0.0.1:${process.env.AGENT_PORT ?? 4111}`;

const probes = [
  { name: "Web liveness", url: new URL("/api/health", webUrl) },
  { name: "Agent liveness", url: new URL("/health/live", agentUrl) },
  { name: "Agent readiness", url: new URL("/health/ready", agentUrl) },
];

await Promise.all(
  probes.map(async ({ name, url }) => {
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
    assert.equal(response.status, 200, `${name} returned ${response.status}`);
    const body = await response.json();
    assert.equal(body.status, "ok", `${name} is not healthy`);
    process.stdout.write(`PASS ${name}\n`);
  })
);

process.stdout.write(
  "Foundation smoke checks passed. Business workflows and external integrations are not tested.\n"
);
