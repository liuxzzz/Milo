# Milo

**English** | [简体中文](README.zh-CN.md)

> Your personal investment assistant.

Milo aims to be a personal investment assistant for portfolio analysis and company research.

## Status

The infrastructure foundation is in place: a Web workspace with empty states, a persistent Mastra service, PostgreSQL integration, shared packages, Ultracite standards, and container configuration. Investment workflows, live ledger integration, and model calls are not implemented yet.

## Architecture

V1.0 uses **Next.js + TypeScript + Mastra + PostgreSQL** in a pnpm workspace. A persistent Node.js service owns the Agent runtime lifecycle. Dependency versions are pinned for this foundation; real MCP access, human confirmation, and business workflow recovery still require separate acceptance tests.

The Web app uses **Tailwind CSS v4 + Magic UI + shadcn/ui**. Prefer Magic UI when it fits the required interaction; fall back to shadcn/ui, keeping the shared warm paper theme. See the [Web component guide](apps/web/README.md).

## Local development

Use **Node.js 24.22.3** (`.node-version`), **pnpm 10.34.9** (`packageManager`), and a running Docker engine.

```bash
cp .env.example .env
pnpm install
pnpm infra:up
pnpm dev
```

Open [Milo](http://localhost:3000). The Agent service listens on `127.0.0.1:4111` and exposes health endpoints only. No model or ledger credentials are needed.

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
