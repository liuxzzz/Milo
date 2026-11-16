import { WorkspaceShell } from "@/components/workspace-shell";
import { workspaceViews } from "@/lib/workspace";

export default function OverviewPage() {
  return <WorkspaceShell view={workspaceViews[0]} />;
}
