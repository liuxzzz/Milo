# Milo Web 组件

使用 Next.js App Router、Tailwind CSS v4、Magic UI 与 shadcn/ui。现有页面仍为基础空态，无投资业务逻辑。

## 选择顺序

先查 Magic UI 是否有符合当前交互、无障碍与视觉要求的组件，没有合适组件时使用 shadcn/ui。两者均未覆盖的业务组合，再基于已有组件封装。动效按实际交互需要使用，遵循减少动态效果设置。

| 当前组件 | 来源 | 使用位置 |
| --- | --- | --- |
| DotPattern | Magic UI | 空态图解局部的静态点阵 |
| Button | shadcn/ui，Radix Slot | 导航链接、404 返回链接 |
| Badge | shadcn/ui | 开发中、尚未接入标签 |
| Empty | shadcn/ui | 五个页面的空态布局 |

点阵默认没有循环动画；原有等轴测线稿作为业务图解保留。页面不展示模拟数据或虚构运行状态。

## 目录与主题

- `components.json`：shadcn 配置与 `@magicui` 官方 registry。
- `postcss.config.mjs`：Tailwind PostCSS 插件。
- `src/app/globals.css`：Tailwind 入口、语义主题变量与基础样式；背景为 `#F5F3EF`、正文为 `#191615`。
- `src/components/magicui`：Magic UI 源组件与必要的本地适配。
- `src/components/ui`：shadcn 源组件。
- `src/lib/utils.ts`：导出当前 shadcn 使用的 `cn` 类名合并函数。

布局使用 Tailwind utility，颜色使用 `bg-background`、`text-foreground`、`text-muted-foreground`、`border-border` 等语义 token。避免在页面复制一套独立颜色或重新手写已有基础控件。

## 添加组件

在仓库根目录使用已固定版本的 CLI：

```bash
# 优先查看 Magic UI；替换为实际需要的组件名
pnpm --filter @milo/web exec shadcn add @magicui/blur-fade --path src/components/magicui

# Magic UI 不覆盖所需交互时使用 shadcn/ui
pnpm --filter @milo/web exec shadcn add dialog

pnpm fix
pnpm check
pnpm --filter @milo/web typecheck
```

只添加当前需要的组件。生成后核对 API、语义标签、主题、焦点和 reduced-motion 行为，再接入页面；不要直接覆盖已经适配的组件。Magic UI DotPattern 保留官方出处、MIT 许可和本地修改说明；shadcn 源组件许可见 `THIRD_PARTY_NOTICES.md`。

参考：[Tailwind Next.js 安装](https://tailwindcss.com/docs/installation/framework-guides/nextjs)、[Magic UI 安装](https://magicui.design/docs/installation)、[shadcn 手动安装](https://ui.shadcn.com/docs/installation/manual)。
