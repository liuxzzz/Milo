import { z } from "zod";

export { Decimal } from "decimal.js";

export const healthResponseSchema = z.object({
  service: z.string().min(1),
  status: z.enum(["ok", "unavailable"]),
  timestamp: z.iso.datetime(),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;
