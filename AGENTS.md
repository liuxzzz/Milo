# Milo engineering conventions

## Scope and architecture

- Read `docs/ADR-001-MASTRA.zh-CN.md` before changing runtime boundaries.
- Keep Web and business APIs in `apps/web`; run long tasks in the persistent `apps/agent-service` process.
- Use `packages/domain` for deterministic rules, `packages/connectors` for external integrations, `packages/db` for business persistence, and `packages/agent` for Mastra composition.
- Keep Mastra runtime storage separate from Milo business schemas. Workflow checkpoints do not replace business transactions, confirmation, or idempotency.
- The current milestone is infrastructure only. Do not invent portfolio data, implement investment workflows, or imply that real MCP, model calls, or workflow crash recovery have been validated.

## Ultracite code standards

This repository uses Ultracite with Biome. The root preset is `ultracite/biome/core`; the Web workspace also enables React and Next.js presets.

- Run `pnpm check` to check formatting and lint, `pnpm fix` to apply safe fixes, and `pnpm lint:doctor` to diagnose the configuration.
- Run `pnpm verify` before handing off code. Use `pnpm smoke` against a running local stack for integration verification.
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
