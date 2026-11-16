import Link from "next/link";
import { type WorkspaceView, workspaceViews } from "@/lib/workspace";

export function WorkspaceShell({ view }: { view: WorkspaceView }) {
  return (
    <div className="workspace">
      <a className="skip-link" href="#main-content">
        跳转到内容
      </a>
      <aside className="sidebar">
        <Link aria-label="Milo 首页" className="brand" href="/">
          <span aria-hidden="true" className="brand-mark">
            m.
          </span>
          <span>Milo</span>
        </Link>
        <p className="sidebar-caption">你的个人投资助手</p>
        <nav aria-label="主导航" className="navigation">
          {workspaceViews.map((item) => (
            <Link
              aria-current={item.slug === view.slug ? "page" : undefined}
              className="nav-link"
              href={item.href}
              key={item.slug}
            >
              <span>{item.label}</span>
              <span aria-hidden="true" className="nav-indicator">
                ↗
              </span>
            </Link>
          ))}
        </nav>
        <p className="sidebar-footer">想清楚，再向前。</p>
      </aside>
      <div className="main-column">
        <header className="workspace-header">
          <span className="workspace-label">个人工作台</span>
          <span className="development-label">开发中</span>
        </header>
        <main className="main-content" id="main-content" tabIndex={-1}>
          <div className="page-heading">
            <p className="eyebrow">{view.eyebrow}</p>
            <h1>{view.title}</h1>
            <p className="page-description">{view.description}</p>
          </div>
          <section aria-labelledby="empty-title" className="empty-state">
            <svg
              aria-hidden="true"
              className="empty-illustration"
              fill="none"
              focusable="false"
              viewBox="0 0 160 140"
            >
              <ellipse
                cx="80"
                cy="116"
                fill="currentColor"
                opacity="0.05"
                rx="52"
                ry="12"
              />
              <path d="m28 77 52-30 52 30-52 30Z" fill="var(--surface-shade)" />
              <path d="m28 77 52 30v12L28 89Z" fill="var(--surface-muted)" />
              <path d="m80 107 52-30v12l-52 30Z" fill="var(--surface-shade)" />
              <path
                d="m28 77 52-30 52 30v12l-52 30-52-30Zm0 0 52 30 52-30m-52 30v12"
                stroke="currentColor"
                strokeLinejoin="round"
              />
              <path
                d="m38 49 42-24 42 24-42 24Z"
                fill="var(--paper)"
                stroke="currentColor"
                strokeLinejoin="round"
              />
              <path
                d="m57 49 23-13m-13 19 23-13"
                opacity="0.4"
                stroke="currentColor"
                strokeLinecap="round"
              />
              <path
                d="M38 58v9m84-9v9"
                opacity="0.4"
                stroke="currentColor"
                strokeDasharray="2 4"
              />
            </svg>
            <span className="empty-status">尚未接入</span>
            <h2 id="empty-title">{view.emptyTitle}</h2>
            <p>{view.emptyDescription}</p>
          </section>
          <footer className="page-footer">
            <span>Milo</span>
            <span>Your personal investment assistant.</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
