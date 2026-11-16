FROM node:24.22.3-bookworm-slim AS base
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm install --global pnpm@10.34.9
WORKDIR /app

FROM base AS build
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm build
RUN pnpm --filter @milo/agent-service deploy --prod --legacy /output/agent

FROM node:24.22.3-bookworm-slim AS agent
ENV NODE_ENV=production
ENV AGENT_HOST=0.0.0.0
ENV AGENT_PORT=4111
WORKDIR /app
COPY --from=build --chown=node:node /output/agent ./
USER node
EXPOSE 4111
CMD ["node", "dist/main.js"]

FROM node:24.22.3-bookworm-slim AS web
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
WORKDIR /app
COPY --from=build --chown=node:node /app/apps/web/.next/standalone ./
COPY --from=build --chown=node:node /app/apps/web/.next/static ./apps/web/.next/static
USER node
EXPOSE 3000
CMD ["node", "apps/web/server.js"]
