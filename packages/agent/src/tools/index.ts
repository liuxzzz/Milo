import type { Config } from "@mastra/core/mastra";

// Only register tools with explicit input, output, and permission contracts.
export const tools = {} satisfies NonNullable<Config["tools"]>;
