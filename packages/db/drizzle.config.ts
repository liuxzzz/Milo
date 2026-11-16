import { defineConfig } from "drizzle-kit";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required for database commands.");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  out: "./drizzle",
  schemaFilter: ["milo"],
  dbCredentials: { url: connectionString },
  migrations: {
    schema: "milo_migrations",
    table: "__drizzle_migrations",
  },
  strict: true,
});
