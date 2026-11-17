# Milo

**English** | [简体中文](README.zh-CN.md)

> Your personal investment assistant.

Milo aims to be a personal investment assistant for portfolio analysis and company research.

## Status

The infrastructure foundation is in place: a Web workspace with empty states and a chat UI at `/chat`, a persistent Mastra service, PostgreSQL integration, shared packages, Ultracite standards, and container configuration. The chat page supports editing a draft and prefilling it from suggestions; sending is disabled. Investment workflows, live ledger integration, model calls, and remote conversation persistence are not implemented yet; conversation recovery has not been validated.

## Architecture

V1.0 uses **Next.js + TypeScript + Mastra + PostgreSQL** in a pnpm workspace. A persistent Node.js service owns the Agent runtime lifecycle. Dependency versions are pinned for this foundation; real MCP access, human confirmation, and business workflow recovery still require separate acceptance tests.

The Web app uses **Tailwind CSS v4 + assistant-ui + Magic UI + shadcn/ui**. Agent chat components use assistant-ui; general UI prefers Magic UI when it fits the required interaction, then shadcn/ui, keeping the shared warm paper theme. The current chat runtime is a UI-only external-store adapter; future data will come from the separate Mastra service, without an Assistant Cloud dependency. See the [Web component guide](apps/web/README.md) for pinned versions and integration limits.

## Local development

Use **Node.js 24.22.3** (`.node-version`), **pnpm 10.34.9** (`packageManager`), and a running Docker engine.

```bash
cp .env.example .env
pnpm install
pnpm infra:up
pnpm dev
```

Open [Milo](http://localhost:3000) or the [chat UI](http://localhost:3000/chat). The Agent service listens on `127.0.0.1:4111` and exposes health endpoints only. No model or ledger credentials are needed for the current UI.

Alternatively, run the complete container stack with `docker compose up --build -d --wait`. Choose one mode: both use the same default ports.

## Code quality

[Ultracite](https://www.ultracite.ai/) configures Biome core rules at the root, with React and Next.js presets in the Web workspace.

```bash
pnpm check         # Lint, format, and import order
pnpm fix           # Safe automated fixes
pnpm lint:doctor   # Diagnose Ultracite configuration
pnpm verify        # Lint, build, typecheck, and foundation tests
pnpm smoke         # Probe an already running local stack
```

See the [development guide (简体中文)](docs/DEVELOPMENT.zh-CN.md) for environment variables, package boundaries, database migrations, and validation limits.

## Planning

- [V1.0 eight-week plan (简体中文)](docs/MILO-V1-PLAN.zh-CN.md)
- [Product and open-source research (简体中文)](docs/COMPETITORS.zh-CN.md)
- [Architecture decision: Mastra (简体中文)](docs/ADR-001-MASTRA.zh-CN.md)
