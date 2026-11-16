import { Mastra } from "@mastra/core/mastra";
import { PostgresStore } from "@mastra/pg";
import { Pool } from "pg";
import { agents } from "./agents/index.js";
import { tools } from "./tools/index.js";
import { workflows } from "./workflows/index.js";

export interface AgentRuntimeOptions {
  databaseUrl: string;
  schemaName: string;
}

export const createAgentRuntime = ({
  databaseUrl,
  schemaName,
}: AgentRuntimeOptions) => {
  const pool = new Pool({
    application_name: "milo-agent-service",
    connectionString: databaseUrl,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30_000,
    max: 5,
    query_timeout: 10_000,
  });

  const storage = new PostgresStore({
    id: "milo-mastra-storage",
    pool,
    schemaName,
  });

  const mastra = new Mastra({ agents, tools, workflows, storage });

  // Handle idle-client errors without exposing connection strings in our logs.
  pool.on("error", () => {
    mastra.getLogger().error("An idle runtime database connection failed");
  });

  let started = false;
  let stopPromise: Promise<void> | undefined;

  const start = async () => {
    if (stopPromise) {
      throw new Error("A stopped runtime cannot be restarted");
    }

    if (started) {
      return;
    }

    await pool.query("SELECT 1");
    // Mastra 1.83 initializes storage before starting its registered workers.
    await mastra.startWorkers();
    started = true;
  };

  const checkReady = async () => {
    if (!started) {
      return false;
    }

    await pool.query("SELECT 1");
    return started;
  };

  const stop = () => {
    started = false;
    stopPromise ??= (async () => {
      try {
        await mastra.shutdown({ drainTimeout: 5000 });
      } finally {
        try {
          await storage.close();
        } finally {
          // PostgresStore never closes an externally supplied pool.
          await pool.end();
        }
      }
    })();
    return stopPromise;
  };

  return { mastra, storage, start, checkReady, stop };
};

export type AgentRuntime = ReturnType<typeof createAgentRuntime>;
