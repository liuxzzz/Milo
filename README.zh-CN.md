# Milo

[English](README.md) | **简体中文**

> 你的个人投资助手。

Milo 致力于成为你的个人投资助手，帮助你分析投资组合、研究公司。

## 项目状态

基础工程已搭建：包含 Web 空态工作台、常驻 Mastra 服务、PostgreSQL 接入、共享包、Ultracite 代码规范与容器配置。投资业务逻辑、真实账本连接及模型调用尚未实现。

## 技术方案

V1.0 采用 **Next.js + TypeScript + Mastra + PostgreSQL**。前端、Agent 服务与共享包通过 pnpm workspace 管理；由常驻 Node.js 服务管理 Agent 与工作流生命周期。当前依赖版本已写入锁文件，真实 MCP、用户确认与业务任务恢复仍需单独验收。

Web 使用 **Tailwind CSS v4 + Magic UI + shadcn/ui**。组件优先选用 Magic UI，不覆盖所需交互时使用 shadcn/ui，统一沿用暖纸主题。配置与添加方式见 [Web 组件说明](apps/web/README.md)。

## 本地开发

使用 `.node-version` 指定的 **Node.js 24.22.3** 和 `packageManager` 指定的 **pnpm 10.34.9**，并启动 Docker。

```bash
cp .env.example .env
pnpm install
pnpm infra:up
pnpm dev
```

打开 [Milo 工作台](http://localhost:3000)。Agent 服务默认运行在 `127.0.0.1:4111`，仅提供健康检查。

也可以直接启动完整容器栈：

```bash
docker compose up --build -d --wait
```

两种模式共用默认端口，请选择一种运行。业务页面均为空态，无需模型密钥或账本凭据。

## 工程检查

代码规范使用 [Ultracite](https://www.ultracite.ai/) 的 Biome presets：根目录 core，Web 额外启用 React / Next.js。

```bash
pnpm check         # 格式、lint、导入排序
pnpm fix           # 安全自动修复
pnpm lint:doctor   # Ultracite 配置诊断
pnpm verify        # lint、构建、类型检查、基础测试
pnpm smoke         # 已运行栈的健康与就绪检查
```

详细目录、环境变量、迁移与验证边界见 [开发说明](docs/DEVELOPMENT.zh-CN.md)。

## 项目规划

- [V1.0 八周开发规划](docs/MILO-V1-PLAN.zh-CN.md)
- [竞品与开源方案调研](docs/COMPETITORS.zh-CN.md)
- [架构决策：采用 Mastra](docs/ADR-001-MASTRA.zh-CN.md)
