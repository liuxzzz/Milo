import { pgSchema } from "drizzle-orm/pg-core";

/** All future Milo business tables belong here; Mastra owns its own schema. */
export const miloSchema = pgSchema("milo");
