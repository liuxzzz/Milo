import assert from "node:assert/strict";
import { once } from "node:events";
import test from "node:test";
import { healthResponseSchema } from "@milo/domain";
import { createHealthServer } from "./http.js";

test("health distinguishes liveness, readiness and dependency failures", async (t) => {
  let state: "ready" | "starting" | "failed" = "starting";
  const server = createHealthServer({
    checkReady: () => {
      if (state === "failed") {
        return Promise.reject(
          new Error("postgresql://private:secret@database")
        );
      }
      return Promise.resolve(state === "ready");
    },
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => {
    server.closeAllConnections();
    server.close();
  });

  const address = server.address();
  assert.ok(address && typeof address !== "string");
  const url = `http://127.0.0.1:${address.port}`;
  assert.equal((await fetch(`${url}/health/live`)).status, 200);
  assert.equal((await fetch(`${url}/health/ready`)).status, 503);

  state = "ready";
  assert.equal((await fetch(`${url}/health/ready`)).status, 200);

  state = "failed";
  const failedResponse = await fetch(`${url}/health/ready`);
  assert.equal(failedResponse.status, 503);
  const payload = healthResponseSchema.parse(await failedResponse.json());
  assert.equal(payload.service, "agent-service");
  assert.equal(payload.status, "unavailable");
  assert.equal((await fetch(`${url}/api/workflows`)).status, 404);
  assert.equal(
    (await fetch(`${url}/health/live`, { method: "POST" })).status,
    405
  );
});
