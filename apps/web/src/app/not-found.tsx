import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <main className="mx-auto my-[16vh] max-w-[720px] px-6 py-8 sm:px-8">
      <p className="text-muted-foreground mb-4 font-mono text-xs tracking-[0.09em]">
        MILO / 404
      </p>
      <h1 className="text-[clamp(32px,3vw,44px)] leading-[1.3] font-[450] tracking-[-0.035em]">
        没有找到这个页面
      </h1>
      <p className="text-muted-foreground mt-5">你可以返回工作台，继续浏览。</p>
      <Button asChild className="mt-6 min-h-11 rounded-[10px] px-5 shadow-none">
        <Link href="/">返回总览</Link>
      </Button>
    </main>
  );
}
