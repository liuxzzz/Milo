import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="not-found">
      <p className="eyebrow">MILO / 404</p>
      <h1>没有找到这个页面</h1>
      <p>你可以返回工作台，继续浏览。</p>
      <Link className="primary-link" href="/">
        返回总览
      </Link>
    </main>
  );
}
