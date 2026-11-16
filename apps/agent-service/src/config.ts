import { z } from "zod";

const postgresUrl = z.url().refine((value) => {
  const { protocol } = new URL(value);
  return protocol === "postgres:" || protocol === "postgresql:";
}, "Must be a PostgreSQL connection URL");

const postgresComponentsSchema = z.object({
  PGHOST: z
    .string()
    .min(1)
    .refine((value) => {
      try {
        const parsed = new URL(`postgresql://${value}`);
        return (
          parsed.hostname === value &&
          parsed.port === "" &&
          parsed.username === "" &&
          parsed.password === "" &&
          parsed.pathname === "" &&
          parsed.search === "" &&
          parsed.hash === ""
        );
      } catch {
        return false;
      }
    }),
  PGPORT: z.coerce.number().int().min(1).max(65_535),
  PGDATABASE: z.string().min(1),
  PGUSER: z.string().min(1),
  PGPASSWORD: z.string().min(1),
});

const configurationError = (error: z.ZodError) => {
  const fields = [...new Set(error.issues.map((issue) => issue.path[0]))];
  // Values may contain credentials; report field names only.
  return new Error(`Invalid agent service configuration: ${fields.join(", ")}`);
};

const resolveDatabaseUrl = (environment: NodeJS.ProcessEnv) => {
  if (environment.DATABASE_URL !== undefined) {
    return environment.DATABASE_URL;
  }

  const result = postgresComponentsSchema.safeParse(environment);
  if (!result.success) {
    throw configurationError(result.error);
  }

  const { PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD } = result.data;
  const url = new URL(`postgresql://${PGHOST}:${PGPORT}`);
  // Encode components before setting them: URL setters preserve literal "%".
  url.username = encodeURIComponent(PGUSER);
  url.password = encodeURIComponent(PGPASSWORD);
  url.pathname = `/${encodeURIComponent(PGDATABASE)}`;
  return url.toString();
};

const configurationSchema = z.object({
  DATABASE_URL: postgresUrl,
  MASTRA_SCHEMA: z
    .string()
    .regex(/^[a-z][a-z0-9_]*$/u)
    .refine((value) => value !== "public" && value !== "milo", {
      message: "Mastra must use a dedicated schema",
    })
    .default("mastra"),
  AGENT_HOST: z.string().min(1).default("127.0.0.1"),
  AGENT_PORT: z.coerce.number().int().min(1).max(65_535).default(4111),
});

export const parseServiceConfig = (environment: NodeJS.ProcessEnv) => {
  const result = configurationSchema.safeParse({
    ...environment,
    DATABASE_URL: resolveDatabaseUrl(environment),
  });

  if (!result.success) {
    throw configurationError(result.error);
  }

  return {
    databaseUrl: result.data.DATABASE_URL,
    schemaName: result.data.MASTRA_SCHEMA,
    host: result.data.AGENT_HOST,
    port: result.data.AGENT_PORT,
  };
};
