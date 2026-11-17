"use client";

import {
  AssistantRuntimeProvider,
  type ExternalStoreAdapter,
  type ThreadMessage,
  useExternalStoreRuntime,
} from "@assistant-ui/react";
import { MiloThread } from "@/components/assistant-ui/thread";

// This UI-only runtime keeps drafts editable without issuing model requests.
// Replace it with the authenticated Agent-service transport when chat is ready.
const unavailableChatAdapter: ExternalStoreAdapter<ThreadMessage> = {
  messages: [],
  isRunning: false,
  isSendDisabled: true,
  onNew: () => Promise.reject(new Error("对话服务尚未开放，消息未发送。")),
};

export function AssistantWorkspace() {
  const runtime = useExternalStoreRuntime(unavailableChatAdapter);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <MiloThread />
    </AssistantRuntimeProvider>
  );
}
