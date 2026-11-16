import { MCPClient, type MCPClientOptions } from "@mastra/mcp";

export interface McpConnectorOptions {
  /** Exact Mastra namespaced names, such as ledger_get_accounts. */
  allowedTools: readonly string[];
  id: string;
  servers: MCPClientOptions["servers"];
  timeoutMs?: number;
}

/** Construction is local; tools are discovered only when listTools is called. */
export function createMcpConnector(options: McpConnectorOptions) {
  const allowedTools = new Set(options.allowedTools);
  const client = new MCPClient({
    id: options.id,
    servers: options.servers,
    timeout: options.timeoutMs ?? 30_000,
    registerProcessHooks: false,
  });

  return {
    async listTools() {
      if (allowedTools.size === 0) {
        return {};
      }

      const tools = await client.listTools();
      const missing = [...allowedTools].filter(
        (name) => !Object.hasOwn(tools, name)
      );

      if (missing.length > 0) {
        throw new Error(
          `Configured MCP tools were not found: ${missing.join(", ")}`
        );
      }

      return Object.fromEntries(
        Object.entries(tools).filter(([name]) => allowedTools.has(name))
      );
    },
    disconnect: () => client.disconnect(),
  };
}
