export const workspaceViews = [
  {
    slug: "overview",
    href: "/",
    label: "总览",
    eyebrow: "OVERVIEW",
    title: "持仓总览",
    description: "从真实账户出发，了解你的投资组合。",
    emptyTitle: "还没有账户数据",
    emptyDescription:
      "账本连接功能准备中。接入后，持仓与资产配置将在这里显示。",
  },
  {
    slug: "chat",
    href: "/chat",
    label: "对话",
    eyebrow: "CONVERSATION",
    title: "投资对话",
    description: "从一个问题开始，一起理解你的投资。",
    emptyTitle: "今天想聊些什么？",
    emptyDescription: "对话服务准备中，你可以先整理想讨论的问题。",
  },
  {
    slug: "research",
    href: "/research",
    label: "研究",
    eyebrow: "RESEARCH",
    title: "公司研究",
    description: "围绕公司、证据和待验证的问题展开研究。",
    emptyTitle: "还没有研究报告",
    emptyDescription: "研究功能准备中。未来的报告与引用资料将在这里整理。",
  },
  {
    slug: "theses",
    href: "/theses",
    label: "投资档案",
    eyebrow: "INVESTMENT THESES",
    title: "投资档案",
    description: "留下每一次判断的理由、假设和观察条件。",
    emptyTitle: "还没有投资档案",
    emptyDescription:
      "档案功能准备中。你确认的投资理由与历史版本将在这里保存。",
  },
  {
    slug: "reviews",
    href: "/reviews",
    label: "复查记录",
    eyebrow: "REVIEWS",
    title: "复查记录",
    description: "用新的证据，重新审视当时的判断。",
    emptyTitle: "还没有复查记录",
    emptyDescription: "复查功能准备中。操作复盘与投资理由复查将在这里留存。",
  },
  {
    slug: "settings",
    href: "/settings",
    label: "设置",
    eyebrow: "SETTINGS",
    title: "设置",
    description: "管理你的账户连接与个人偏好。",
    emptyTitle: "连接与偏好尚未开放",
    emptyDescription:
      "当前版本仅提供工作台基础框架，暂未接入账户或保存个人设置。",
  },
] as const;

export type WorkspaceView = (typeof workspaceViews)[number];

export function findWorkspaceView(slug: string) {
  return workspaceViews.find((view) => view.slug === slug);
}
