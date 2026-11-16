# Connectors

`createMcpConnector` creates an explicitly configured Mastra MCP client. It does
not read environment variables, start a subprocess, or connect during creation.
Call `listTools()` to discover and expose only the exact names in `allowedTools`;
an empty allowlist returns no tools without discovery. Names are Mastra namespaced
keys, for example `ledger_get_accounts`. A missing allowed tool fails discovery
instead of silently accepting a changed server contract.

The service that owns a connector must call `disconnect()` during shutdown.
Mastra process hooks are disabled so connectors cannot take over the service's
signal handlers. Authentication and server transport are passed through the
explicit `servers` configuration. There is no configured ledger connection yet.

The allowlist restricts tools exposed by this wrapper. Tool names and server
annotations alone do not establish that an operation is read-only; verify actual
ledger capabilities before registering tools in a business workflow.
