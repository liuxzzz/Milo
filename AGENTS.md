# Milo engineering conventions

## Scope and architecture

- Read `docs/ADR-001-MASTRA.zh-CN.md` before changing runtime boundaries.
- Keep Web and business APIs in `apps/web`; run long tasks in the persistent `apps/agent-service` process.
- Keep Mastra runtime storage separate from Milo business schemas. Workflow checkpoints do not replace business transactions, confirmation, or idempotency.
- The current milestone is infrastructure only; reserved paths below do not expand that scope. Do not invent portfolio data, implement investment workflows, or imply that real MCP, model calls, or workflow crash recovery have been validated.
- Use `docs/DEVELOPMENT.zh-CN.md` for environment setup, migrations, service lifecycle, and recorded validation results when those topics are relevant.

## Reserved file layout

This is a placement guide for future work. Paths marked `[planned]` (including their children) do not exist yet. Create them when a requested feature needs them; avoid empty scaffolding or moving working code solely to match the tree.

```text
apps/
  web/src/
    app/                       # Pages, layouts, and route handlers
      api/                     # Business HTTP endpoints
    components/                # UI components
    server/                    # [planned] Server-only application code
      services/                # Business use cases and transaction coordination
      agent-client/            # Calls to the persistent Agent service
      auth/                    # Authentication and authorization
  agent-service/src/
    main.ts                    # Process startup, HTTP listener, shutdown signals
    config.ts                  # Environment validation
    http.ts                    # HTTP server assembly; currently health endpoints
    routes/                    # [planned] Agent service endpoints
    middleware/                # [planned] Service authentication and request context
packages/
  agent/src/
    agents/                    # Agent definitions
    workflows/                 # Workflow orchestration
    tools/                     # Mastra tool definitions and adapters
    scorers/                   # [planned] Executable evaluation scorers
    storage.ts                 # [planned] Mastra runtime storage configuration
    runtime.ts                 # [planned] Runtime factory and start/stop lifecycle
    index.ts                   # Public exports; currently also runtime implementation
  domain/src/                  # Deterministic business rules and calculations
  connectors/src/              # External clients and MCP connections
  db/src/                      # Business persistence and schema
  contracts/src/               # [planned] Shared request/response schemas and types
evals/                         # Versioned evaluation fixtures and results
skills/                        # Versioned task specifications; not workflow code
```

## Dependency and integration boundaries

- Keep Web route handlers focused on request validation, authorization, and responses; put business use cases in `server/services`. Mark Web server modules with `server-only`. Call the Agent service through `server/agent-client` rather than importing its runtime into Web.
- Keep `@milo/agent`, `@milo/db`, and credentialed connectors out of browser code. Shared packages must not import from `apps/*`; keep `domain` and future `contracts` independent of Mastra, database clients, and network I/O.
- Introduce `packages/contracts` when shared business API contracts are needed. Keep small existing health contracts in place until that extraction is useful; shared request/response schemas belong in contracts, deterministic business decisions in domain.
- Keep process signals and HTTP ownership in `apps/agent-service`; keep reusable Mastra composition and runtime lifecycle in `packages/agent`. Extract `storage.ts` and `runtime.ts` as that implementation grows.
- Keep external transport and connection cleanup in connectors, and workflow orchestration in agent. The existing MCP connector uses Mastra's SDK; add framework-independent clients only when reuse requires them.
- When adding Agent HTTP APIs and Studio, prefer an [official server adapter](https://mastra.ai/docs/server/server-adapters) for the existing custom service. A Mastra CLI entry at `src/mastra/index.ts` is an alternative tooling choice, not a required directory migration. Register definitions in code when using an adapter.

## Ultracite code standards

This repository uses Ultracite with Biome. The root preset is `ultracite/biome/core`; the Web workspace also enables React and Next.js presets.

- Run `pnpm check` to check formatting and lint, `pnpm fix` to apply safe fixes, and `pnpm lint:doctor` to diagnose the configuration.
- For code changes, run `pnpm verify` before handoff. For service integration changes, also use `pnpm smoke` against a running local stack. For documentation-only changes, check content, links, and the diff; application builds and runtime tests are unnecessary.
- Use strict TypeScript, explicit input validation, and `unknown` with narrowing instead of `any`.
- Handle asynchronous failures and resource cleanup explicitly. Never log secrets or complete database URLs.
- Use semantic accessible HTML, descriptive links, keyboard focus states, and truthful empty states.
- Use named exports for library APIs, `import type` for types, and `.js` relative imports in Node ESM source.
- Do not suppress lint rules globally to make a check pass. Document any narrowly scoped exception at its source.
- Do not commit `.env`, credentials, generated builds, or local database data.

## Web design

Use the existing warm paper palette and spacing in `apps/web/src/app/globals.css`. Follow the user's warm technical design guide when extending the UI. Product screens should describe user tasks, not internal implementation details.

- Use Tailwind CSS v4 for layout and styling, with semantic shadcn theme variables in `globals.css`.
- Component selection order: Magic UI first when it fits the interaction, accessibility, and visual requirements; otherwise use shadcn/ui. Write a custom primitive only when neither library covers the need.
- Use the configured `@magicui` registry in `apps/web/components.json`. Keep Magic UI components in `src/components/magicui` and shadcn primitives in `src/components/ui`.
- Preserve the warm paper theme, keyboard behavior, and reduced-motion support when adapting registry components. Decorative effects must stay local to illustrations and must not suggest live data or active work.
- Use the shared `cn` helper for class merging. Run Ultracite on generated component source too; do not exclude vendor-derived UI files from checks.
