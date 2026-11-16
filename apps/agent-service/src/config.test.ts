import assert from "node:assert/strict";
import test from "node:test";
import { parseServiceConfig } from "./config.js";

const databaseUrl = "postgresql://milo:local-password@localhost:5432/milo";

const postgresEnvironment = {
  PGHOST: "postgres",
  PGPORT: "5432",
  PGDATABASE: "milo",
  PGUSER: "milo",
  PGPASSWORD: "p@ss/#:% word?密钥",
};

test("PostgreSQL component credentials are encoded without changing their values", () => {
  const config = parseServiceConfig({
    ...postgresEnvironment,
    PGUSER: "milo@local",
    PGDATABASE: "milo/research",
  });
  const url = new URL(config.databaseUrl);
  assert.equal(url.hostname, "postgres");
  assert.equal(url.port, "5432");
  assert.equal(decodeURIComponent(url.username), "milo@local");
  assert.equal(
    decodeURIComponent(url.password),
    postgresEnvironment.PGPASSWORD
  );
  assert.equal(decodeURIComponent(url.pathname.slice(1)), "milo/research");
  assert.equal(url.hash, "");
  assert.equal(url.search, "");
});

test("DATABASE_URL takes priority over PostgreSQL component fields", () => {
  const config = parseServiceConfig({
    ...postgresEnvironment,
    DATABASE_URL: databaseUrl,
    PGPORT: "invalid",
  });
  assert.equal(config.databaseUrl, databaseUrl);
});

test("missing PostgreSQL component fields fail without exposing credentials", () => {
  const { PGUSER: _user, ...missingUser } = postgresEnvironment;
  assert.throws(() => parseServiceConfig(missingUser), {
    message: "Invalid agent service configuration: PGUSER",
  });
});

test("configuration errors identify fields without exposing credentials", () => {
  assert.throws(
    () => parseServiceConfig({ DATABASE_URL: "https://secret@example.com/db" }),
    { message: "Invalid agent service configuration: DATABASE_URL" }
  );
});

test("runtime storage cannot share the public or business schema", () => {
  for (const schema of ["public", "milo", "bad-schema"]) {
    assert.throws(() =>
      parseServiceConfig({ DATABASE_URL: databaseUrl, MASTRA_SCHEMA: schema })
    );
  }
});

test("invalid ports fail before the server opens a listener", () => {
  for (const port of ["0", "65536", "not-a-port"]) {
    assert.throws(() =>
      parseServiceConfig({ DATABASE_URL: databaseUrl, AGENT_PORT: port })
    );
  }
});
