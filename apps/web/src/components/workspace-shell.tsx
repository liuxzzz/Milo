import Link from "next/link";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { WorkspaceIllustration } from "@/components/workspace-illustration";
import { cn } from "@/lib/utils";
import { type WorkspaceView, workspaceViews } from "@/lib/workspace";

export function WorkspaceShell({
  view,
  children,
}: {
  view: WorkspaceView;
  children?: ReactNode;
}) {
  return (
    <div className="min-h-svh min-[681px]:grid min-[681px]:grid-cols-[200px_minmax(0,1fr)] min-[1025px]:grid-cols-[240px_minmax(0,1fr)]">
      <a
        className="border-foreground bg-background focus-visible:outline-foreground fixed top-3 left-3 z-50 -translate-y-40 rounded-md border px-4 py-3 text-sm focus:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-4"
        href="#main-content"
      >
        跳转到内容
      </a>
      <aside className="border-border flex flex-col border-b px-5 pt-5 pb-3 min-[681px]:border-r min-[681px]:border-b-0 min-[681px]:pt-10 min-[681px]:pb-6 min-[1025px]:px-6">
        <Link
          aria-label="Milo 首页"
          className="focus-visible:outline-foreground flex min-h-11 w-fit items-center gap-3 rounded-sm text-[28px] font-semibold tracking-[-0.05em] focus-visible:outline-2 focus-visible:outline-offset-4"
          href="/"
        >
          <span
            aria-hidden="true"
            className="border-foreground grid size-9 place-items-center rounded-[9px] border text-2xl leading-none font-medium"
          >
            m.
          </span>
          <span>Milo</span>
        </Link>
        <p className="text-muted-foreground mt-1 mb-5 text-[13px] min-[681px]:mt-3 min-[681px]:mb-12">
          你的个人投资助手
        </p>
        <nav
          aria-label="主导航"
          className="grid grid-cols-3 gap-2 min-[681px]:flex min-[681px]:flex-col"
        >
          {workspaceViews.map((item) => (
            <Button
              asChild
              className={cn(
                "text-muted-foreground hover:bg-muted hover:text-foreground h-12 w-full justify-center gap-3 rounded-lg px-1 text-sm font-normal shadow-none transition-colors duration-200 motion-reduce:transition-none min-[681px]:justify-between min-[681px]:px-3 min-[681px]:text-[15px]",
                item.slug === view.slug && "bg-accent text-foreground"
              )}
              key={item.slug}
              variant="ghost"
            >
              <Link
                aria-current={item.slug === view.slug ? "page" : undefined}
                href={item.href}
              >
                <span>{item.label}</span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "hidden font-mono min-[681px]:inline",
                    item.slug !== view.slug && "opacity-0"
                  )}
                >
                  ↗
                </span>
              </Link>
            </Button>
          ))}
        </nav>
        <p className="text-muted-foreground mx-3 mt-auto hidden pt-16 text-xs min-[681px]:block">
          想清楚，再向前。
        </p>
      </aside>
      <div className="flex min-w-0 flex-col">
        <header className="border-border flex min-h-14 items-center justify-between gap-4 border-b px-6 py-3 min-[681px]:min-h-[84px] min-[681px]:px-8 min-[681px]:py-4 min-[1025px]:px-12">
          <span className="text-[13px]">
            {view.slug === "chat" ? "投资对话" : "个人工作台"}
          </span>
          <Badge
            className="border-border text-muted-foreground rounded-md px-2 py-1 font-normal"
            variant="outline"
          >
            开发中
          </Badge>
        </header>
        <main
          className={cn(
            "mx-auto w-full max-w-[1200px] px-6 focus:outline-none min-[681px]:px-8 min-[1025px]:px-16",
            children
              ? "flex min-h-[640px] flex-col py-6 min-[681px]:h-[calc(100svh-84px)] min-[681px]:py-8"
              : "pt-9 pb-6 min-[681px]:pt-12 min-[1025px]:pt-16 min-[1025px]:pb-8"
          )}
          id="main-content"
          tabIndex={-1}
        >
          {children ?? (
            <>
              <div>
                <p className="text-muted-foreground mb-4 font-mono text-xs tracking-[0.09em]">
                  {view.eyebrow}
                </p>
                <h1 className="text-[clamp(32px,3vw,44px)] leading-[1.3] font-[450] tracking-[-0.035em]">
                  {view.title}
                </h1>
                <p className="text-muted-foreground mt-5 text-[15px] min-[681px]:text-base">
                  {view.description}
                </p>
              </div>
              <section
                aria-labelledby="empty-title"
                className="mt-8 min-[681px]:mt-12"
              >
                <Empty className="border-border min-h-[340px] gap-0 rounded-xl border border-solid px-5 py-8 min-[681px]:min-h-[368px] min-[681px]:px-6 min-[681px]:py-10 md:px-6 md:py-10">
                  <EmptyHeader className="max-w-[400px] gap-3">
                    <EmptyMedia className="mb-0" variant="default">
                      <WorkspaceIllustration />
                    </EmptyMedia>
                    <Badge
                      className="text-muted-foreground rounded-md px-2 py-1 font-normal"
                      variant="secondary"
                    >
                      尚未接入
                    </Badge>
                    <EmptyTitle className="text-xl font-medium">
                      <h2 id="empty-title">{view.emptyTitle}</h2>
                    </EmptyTitle>
                    <EmptyDescription className="text-sm leading-[1.8]">
                      {view.emptyDescription}
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              </section>
              <footer className="text-muted-foreground mt-8 flex flex-wrap justify-between gap-x-6 gap-y-2 font-mono text-xs">
                <span>Milo</span>
                <span>Your personal investment assistant.</span>
              </footer>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
