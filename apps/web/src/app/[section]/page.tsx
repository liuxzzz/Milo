import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AssistantWorkspace } from "@/components/assistant-ui/assistant-workspace";
import { WorkspaceShell } from "@/components/workspace-shell";
import { findWorkspaceView, workspaceViews } from "@/lib/workspace";

interface SectionPageProps {
  params: Promise<{ section: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return workspaceViews
    .filter((view) => view.slug !== "overview")
    .map((view) => ({ section: view.slug }));
}

export async function generateMetadata({
  params,
}: SectionPageProps): Promise<Metadata> {
  const { section } = await params;
  return { title: findWorkspaceView(section)?.title ?? "页面未找到" };
}

export default async function SectionPage({ params }: SectionPageProps) {
  const { section } = await params;
  const view = findWorkspaceView(section);

  if (!view || view.slug === "overview") {
    notFound();
  }

  if (view.slug === "chat") {
    return (
      <WorkspaceShell view={view}>
        <AssistantWorkspace />
      </WorkspaceShell>
    );
  }

  return <WorkspaceShell view={view} />;
}
