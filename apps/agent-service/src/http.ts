import {
  createServer,
  type IncomingMessage,
  type ServerResponse,
} from "node:http";
import type { HealthResponse } from "@milo/domain";

interface HealthDependencies {
  checkReady: () => Promise<boolean>;
}

const sendJson = (
  response: ServerResponse,
  statusCode: number,
  body: Record<string, string>
) => {
  response.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
  });
  response.end(JSON.stringify(body));
};

const sendHealth = (response: ServerResponse, available: boolean) => {
  const body = {
    service: "agent-service",
    status: available ? "ok" : "unavailable",
    timestamp: new Date().toISOString(),
  } satisfies HealthResponse;
  sendJson(response, available ? 200 : 503, body);
};

const handleRequest = async (
  request: IncomingMessage,
  response: ServerResponse,
  { checkReady }: HealthDependencies
) => {
  const path = request.url?.split("?")[0];

  if (path !== "/health/live" && path !== "/health/ready") {
    sendJson(response, 404, { error: "not_found" });
    return;
  }

  if (request.method !== "GET") {
    response.setHeader("allow", "GET");
    sendJson(response, 405, { error: "method_not_allowed" });
    return;
  }

  if (path === "/health/live") {
    sendHealth(response, true);
    return;
  }

  try {
    const ready = await checkReady();
    sendHealth(response, ready);
  } catch {
    sendHealth(response, false);
  }
};

export const createHealthServer = (dependencies: HealthDependencies) => {
  const server = createServer((request, response) => {
    handleRequest(request, response, dependencies).catch(() => {
      if (response.headersSent) {
        response.destroy();
      } else {
        sendJson(response, 500, { error: "internal_error" });
      }
    });
  });

  server.requestTimeout = 15_000;
  server.headersTimeout = 10_000;
  return server;
};
