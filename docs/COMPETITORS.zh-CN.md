# Milo 竞品与开源方案调研

调研日期：2026-11-16。范围为官方产品页、帮助文档、仓库 README 及部分源码；未登录付费产品实测，也未运行开源项目验证其质量、性能或投资收益。下文区分官方能力说明与对 Milo 的设计建议。

## 1. 调研结论

现有方案已分别覆盖公司研究、持仓诊断、决策记忆和操作复盘，部分也提供自动运行。Milo 的产品主线应围绕个人投资者自己的账户与投资判断：看懂持仓，研究公司，记录投资理由，必要时回到原始依据复查。

用户已明确不需要每日复盘。Milo V1.0 采用按需研究、按需操作复盘与投资理由复查，不把日内交易节奏、每日总结或每日提醒作为产品前提。

## 2. 产品与工程参考

| 参考 | 官方资料呈现的主要能力 | Milo 借鉴什么 | V1.0 的取舍 |
| --- | --- | --- | --- |
| TradingAgents | 分工分析、多空讨论、风险决策；支持持仓上下文、持久决策日志与后续反思 | 保存判断的时点、观察窗口、证据与后续变化 | 不直接集成整套交易决策链；重点复查用户自己的判断 |
| FinRobot | 当前存在多代实现；V2 工作台强调研究流水线、确定性计算、结构校验与来源追踪 | 财务数值交给程序，模型组织分析；报告中的数字能回到数据 | 不复制整套机构研报、多个估值模型或桌面应用 |
| Dexter | 金融研究任务规划、工具执行、自检、过程记录、评测；源码包含定时执行能力 | 研究任务可观察、有预算与迭代上限、能评测 | 以 Web 工作台交付报告；本版不需要定时消息网关 |
| Fiscal.ai | 公司数据、财报、电话会等研究资料；MCP Skills 封装研究流程与来源引用 | 将事实、财务期间和具体原文绑定 | 供应商覆盖、订阅和额度单独核验，不假设免费或全市场覆盖 |
| PortfolioPilot | 基于实际持仓的组合分析、配置漂移、风险和情景比较 | 回答结合当前账户；仓位试算由确定性计算完成 | 先做集中度、配置和仓位变化；税务、退休规划及复杂回测延后 |
| TradeZella | 交易导入、计划与规则记录、交易及会话复盘；官方宣称支持自动分析 | 对照事前计划、真实成交与后续结果 | 采用按需复盘；长期投资不使用日内胜率作为主要评价 |
| OpenBB Workspace | 结合面板、文件、Skills、MCP 与对话上下文；支持自定义 Agent 和结构化产物 | 让持仓、资料和报告成为可引用的上下文，聊天与工作台联动 | 采用固定业务页面，不建设通用金融工作台平台 |

### TradingAgents

官方资料说明，系统可以传入当前持仓，并保存决策以供后续结算和反思。结算源码考虑交易日、已完成收盘数据和观察窗口，资料不足时保留待处理状态。它复查的主要对象是模型历史决策，这与用户真实成交及其事前理由需要分开建模。

来源：
- [当前持仓说明](https://github.com/TauricResearch/TradingAgents/blob/main/README.md#current-holdings)
- [持久化与恢复](https://github.com/TauricResearch/TradingAgents/blob/main/README.md#persistence-and-recovery)
- [结算与反思实现](https://github.com/TauricResearch/TradingAgents/blob/main/tradingagents/memory/settlement.py)

### FinRobot

当前 README 区分 V0 AutoGen 教育参考、V1 OpenAI Agents SDK Web 应用与 V2 PydanticAI 工作台，因此不能只用早期框架描述其现状。最有借鉴意义的是确定性计算、研究流水线和叙述中的数字校验。官方的成熟度描述不等于本次完成了生产验证。

来源：
- [版本与入口](https://github.com/AI4Finance-Foundation/FinRobot/blob/master/README.md#where-to-start)
- [V2 架构](https://github.com/AI4Finance-Foundation/FinRobot/blob/master/finrobot_desktop/README.md#architecture)
- [研究流水线](https://github.com/AI4Finance-Foundation/FinRobot/blob/master/finrobot_desktop/finrobot/engine/pipelines/equity_research.py)

### Dexter

官方项目采用 TypeScript/Bun，强调自主金融研究、工具使用、自检和评测。定时模块和评测代码可以作为工程参考，但定时监控或消息交付本身不能证明已完成个人操作复盘。

来源：
- [项目说明](https://github.com/virattt/dexter/blob/main/README.md)
- [定时执行器](https://github.com/virattt/dexter/blob/main/src/cron/executor.ts)
- [评测入口](https://github.com/virattt/dexter/blob/main/src/evals/run.ts)

### Fiscal.ai

官方 Terminal 与 MCP Skills 体现了把金融数据、研究任务和文档引用结合的产品方向。Milo 可以学习可追溯研究的交互，但是否采购该服务取决于目标市场、接口费用和实际覆盖；这里不是接入决定。

来源：
- [Terminal](https://fiscal.ai/products/terminal/)
- [MCP Skills](https://docs.fiscal.ai/docs/guides/mcp-skills)
- [产品与数据 FAQ](https://fiscal.ai/help/)

### PortfolioPilot

官方助手介绍包括集中度、风险、组合情景等分析，并明确采用只读方式，不直接向券商下单。Milo 更适合先交付基于账本快照的组合解释与用户指定金额的仓位试算，再以证据说明需要进一步研究的地方。

来源：
- [AI Assistant FAQ](https://portfoliopilot.com/help/faqs/what-can-i-ask-the-ai-assistant)
- [配置漂移与优化](https://portfoliopilot.com/help/faqs/can-portfoliopilot-support-asset-allocation-optimization)
- [组合工具](https://portfoliopilot.com/portfolio-management)

### TradeZella

官方资料覆盖计划、成交导入、交易日记和计划偏离分析，产品文章也描述自动复盘。其后台触发、同步时效和失败补偿没有在本次实测。Milo 只借鉴理由、规则与真实行为对照的思路，采用用户需要时发起的复盘方式。

来源：
- [Start My Day](https://help.tradezella.com/en/articles/16934706-getting-started-with-the-start-my-day-feature)
- [交易导入与日记](https://help.tradezella.com/en/articles/13863136-getting-started-with-tradezella)
- [AI Trading Agents](https://www.tradezella.com/blog/ai-trading-agents)
- [套餐及自动分析说明](https://www.tradezella.com/pricing)

### OpenBB Workspace

官方文档说明了明确选中的数据、Skills、MCP、文件、面板和对话等上下文的组合方式；自定义 Agent 可通过 HTTP/SSE 与工作台交互。Milo 可以让用户从一条持仓或一份研究直接发起后续任务，并保留标的、日期和来源上下文。

来源：
- [上下文管理](https://docs.openbb.co/workspace/analysts/ai-features/copilot-context)
- [自定义 Agent 集成](https://docs.openbb.co/workspace/developers/agents-integration)

## 3. Milo 的取舍

1. 投资记账本 MCP 提供账户事实；公开资料和数据供应商提供公司及市场信息；用户确认自己的投资理由。
2. 金额、仓位和变化由代码计算，模型负责研究计划、证据综合、解释和待确认问题。
3. 保存结论对应的资料版本、统计期间和用户判断版本，让复查能说明依据发生了什么变化。
4. 研究和复盘按需执行，长任务具备阶段进度、恢复、取消和成本记录。
5. 八周内完成单用户的完整体验，先验收一个市场的研究链路；数据源和市场覆盖在第一周锁定。

这些是基于调研提出的设计选择，不是“竞品均不具备”的独占能力声明。
