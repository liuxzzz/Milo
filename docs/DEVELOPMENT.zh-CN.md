# Milo 基础工程开发说明

更新：2026-11-17。

当前交付包含可启动的工程骨架和 `/chat` 的 assistant-ui 对话界面。对话页可以编辑本页草稿，发送尚未开放；持仓、研究、投资档案、复查、用户认证、任务业务 API、模型供应商配置与实际账本接入均待实现。健康检查只能证明基础进程及数据库可用，不能证明投资工作流可用。

## 环境与启动

- Node.js：24.22.3，见 `.node-version`；该版本满足 Ultracite 的运行要求。
- pnpm：10.34.9，见根 `package.json` 的 `packageManager`。
- Docker Engine 与 Compose v2：用于 PostgreSQL 和完整容器栈。
- 依赖版本由 `pnpm-lock.yaml` 固定；CI 与 Docker 使用 `--frozen-lockfile`。

本地开发：

```bash
cp .env.example .env
pnpm install
pnpm infra:up
pnpm dev
```

`pnpm dev` 先构建共享包，再加载根 `.env` 并启动包 watch、Next.js 开发服务器和 Agent 服务。共享包产物使用 ESM + 类型声明；各应用通过 workspace 包导入，避免跨包引用源码路径。

仅调整 Web 时可以使用 `pnpm dev:web`，无需启动数据库或 Agent。仅启动 Agent 可用 `pnpm dev:agent`，但仍需 PostgreSQL。缺少有效数据库配置或数据库不可达时，Agent 启动失败并返回非零退出码。

完整容器栈：

```bash
docker compose up --build -d --wait
pnpm smoke
docker compose down
```

停止服务不会删除数据库 volume。容器端口仅绑定宿主机回环地址，当前配置用于本地开发。容器进程以非 root 用户运行，启用 init 转发信号。Web 与 Agent 分别健康检查；Web 空态界面不依赖 Agent 已就绪。

本地进程与容器模式默认占用相同端口，切换前停止上一种模式。

## 包边界

| 路径 | 当前内容 |
| --- | --- |
| `apps/web` | Next.js App Router、五个业务空态页面、assistant-ui 对话页、Web liveness、Tailwind v4 与 Magic UI / shadcn 暖纸主题 |
| `apps/agent-service` | Node HTTP 健康端点、环境校验、启动和信号关闭 |
| `packages/agent` | Mastra 实例、空 Agents/Workflows/Tools 注册表、PostgresStore 与 worker 生命周期 |
| `packages/domain` | Zod 健康响应契约、Decimal 接入；无财务规则 |
| `packages/connectors` | 显式配置、延迟发现、工具白名单与断连的 MCP factory |
| `packages/db` | Drizzle / pg 连接工厂、schema 边界、迁移配置 |
| `skills` | 任务规范的存放约定；无投资 Skill |
| `evals` | 评测边界说明；无业务评测成绩 |

## 环境变量

`.env` 仅供本地，不能提交真实凭据。根命令统一加载它，包内不隐式寻找其他环境文件。

| 变量 | 用途 |
| --- | --- |
| `DATABASE_URL` | 本地 Agent / Drizzle 的 PostgreSQL 连接串 |
| `POSTGRES_DB` / `POSTGRES_USER` / `POSTGRES_PASSWORD` | Compose 数据库初始化配置；默认值仅供本地 |
| `POSTGRES_PORT` | PostgreSQL 宿主机端口；修改后同步调整本地 `DATABASE_URL` |
| `MASTRA_SCHEMA` | 框架运行 schema，默认 `mastra` |
| `AGENT_HOST` / `AGENT_PORT` | 本地 Agent 监听地址与端口，默认 `127.0.0.1:4111` |
| `PORT` | 本地 Web 端口 / Compose Web 宿主机端口，默认 `3000` |
| `SMOKE_WEB_URL` / `SMOKE_AGENT_URL` | 可选，覆盖 smoke 探针的目标地址 |

Compose 为 Agent 注入独立的 `PGHOST`、`PGPORT`、`PGDATABASE`、`PGUSER`、`PGPASSWORD` 字段，服务校验后编码为连接地址。显式 `DATABASE_URL` 优先，本地自行填写 URI 时需正确编码特殊字符。Agent 容器内部固定监听 `0.0.0.0:4111`；Web 容器内部固定使用 3000。更改数据库初始化凭据不会修改已有 volume 内的账户，已有数据卷需按 PostgreSQL 的正常账户管理流程处理。

## 数据库与迁移

- Mastra PostgresStore 管理 `mastra` schema 的框架运行表。
- Milo 业务 schema 声明为 `milo`，当前尚无业务表或业务 SQL；首次新增业务表的迁移负责建立 schema。
- Drizzle 迁移账本使用 `milo_migrations`，不会接管 Mastra 表。
- 运行 `pnpm db:migrate` 可初始化迁移账本；当前不会写入投资业务数据。

```bash
pnpm db:generate   # 定义业务表后生成待审查迁移
pnpm db:migrate    # 应用已提交的迁移
pnpm db:studio     # 本地数据库查看工具
```

业务迁移由开发/发布步骤显式执行，不在 Web 请求中自动运行。不得让 Drizzle 从整个数据库自动生成并修改 Mastra 运行表。

## 健康检查与生命周期

| 端点 | 含义 |
| --- | --- |
| Web `GET /api/health` | Next.js 进程可响应；不验证数据库、账本或模型 |
| Agent `GET /health/live` | HTTP 进程存活 |
| Agent `GET /health/ready` | runtime 已完成初始化，且 PostgreSQL 查询成功；失败为 503 |

响应字段为 `service`、`status` 和 ISO 时间 `timestamp`。Agent ready 返回 `ok` 或 `unavailable`；不返回连接串和供应商错误详情。

常驻服务启动时检查 PostgreSQL 并调用 Mastra `startWorkers()`，退出时停止接收 HTTP、关闭 runtime、存储和连接池。空工作流注册表不会发起投资任务或调用模型。刷新续读、等待确认、强杀后业务恢复和幂等发布尚无业务实现，不能依据健康端点宣称已验收。

## 代码规范与验证

按 [Ultracite 官方配置](https://www.ultracite.ai/docs/monorepos) 设置 Biome：根目录使用 core，Web 使用 core + React + Next.js。编辑器推荐 Biome 扩展，保存时格式化并安全修复；代码代理约定见根 `AGENTS.md`。

```bash
pnpm lint:doctor
pnpm check
pnpm fix
pnpm typecheck
pnpm test
pnpm verify
pnpm smoke
```

`lint:doctor` 特意避开 pnpm 自身的 `doctor` 命令。`verify` 依次执行代码规范、所有包构建、类型检查和基础测试。`smoke` 需要已运行的栈，检查 Web 与 Agent 的 liveness/readiness。CI 同时执行工程检查和容器启动 smoke。

基础测试不调用付费模型或真实账本。后续必须单独完成 ADR-001 的三项业务验收：真实 MCP、暂停后重启确认、强杀恢复且不重复发布。

## 本次基础验证记录

2026-11-16，使用隔离的 Node.js 24.22.3 / pnpm 10.34.9 工具链完成，未修改系统默认 Node：

- 冻结锁文件安装成功；Ultracite doctor 5 项通过，无警告或失败。
- `pnpm verify` 通过：58 个文件的规范检查、6 个 workspace 构建与类型检查、7 项 Agent 配置/健康测试。
- 本地 PostgreSQL 连接、空业务迁移、Agent 正常启动与退出通过；数据库不可达启动失败符合预期。
- `pnpm dev` 启动后 Web / Agent liveness 和 Agent readiness 三项 smoke 通过。
- Agent 的 pnpm 独立生产部署包实际启动成功；Next.js standalone 在隔离目录中验证页面、健康端点、CSS 和图标成功。
- 使用 ego (lite) 检查五页导航与选中状态，390px 窄屏无横向溢出。
- `docker compose config --quiet` 通过；PostgreSQL 容器实际运行正常。完整 Web / Agent 容器构建在拉取 Node 基础镜像时遇到 Docker Hub 超时、备用官方镜像仓库连接失败，因此 Linux 容器完整启动尚未验证。CI 配置已添加，远端 CI 尚未运行。

本机默认 3000 端口已被其他程序占用，本次未跟踪的 `.env` 使用 `PORT=3310`。仓库示例仍以 3000 为默认值。

## assistant-ui 接入验证

2026-11-17，沿用 Node.js 24.22.3 / pnpm 10.34.9 完成对话 UI 接入：

- `pnpm verify` 通过：70 个文件的规范检查、6 个 workspace 构建与类型检查、7 项既有基础测试。
- `/chat` 使用 assistant-ui 外部状态 runtime；可以编辑草稿和点击示例问题预填。runtime 禁用发送，输入框与表单也阻止提交，未添加聊天 API 或模型请求。
- 使用 ego (lite) 检查建议预填、输入焦点、回车及组合键不发送、刷新清空草稿、研究页与对话页导航。桌面输入框保持在视口内，375px / 390px 窄屏无横向溢出，并检查减少动态效果模式。
- 本次仅启动 Web，在独立端口 `3317` 查看页面，未更改本地 `.env` 或 Agent 服务。未执行服务集成 smoke；未验证真实模型、MCP、会话持久化或断线恢复。
