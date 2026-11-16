import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema.js";

export { miloSchema } from "./schema.js";

export interface DatabaseOptions {
  connectionString: string;
  maxConnections?: number;
  onPoolError?: (error: Error) => void;
}

/** Create one instance per service and close it during graceful shutdown. */
export function createDatabase(options: DatabaseOptions) {
  if (!options.connectionString.trim()) {
    throw new Error("A database connection string is required.");
  }

  const pool = new Pool({
    connectionString: options.connectionString,
    max: options.maxConnections ?? 5,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30_000,
    query_timeout: 5000,
  });

  pool.on(
    "error",
    options.onPoolError ?? ((error) => process.emitWarning(error))
  );

  return {
    db: drizzle({ client: pool, schema }),
    pool,
    async checkConnection() {
      await pool.query("SELECT 1");
    },
    close: () => pool.end(),
  };
}
