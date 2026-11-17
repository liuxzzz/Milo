"use client";

import {
  ComposerPrimitive,
  ErrorPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
  type ToolCallMessagePartProps,
  useAui,
  useAuiState,
} from "@assistant-ui/react";
import { MarkdownTextPrimitive } from "@assistant-ui/react-markdown";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  BookOpen,
  CircleAlert,
} from "lucide-react";
import {
  type FormEvent,
  type MouseEvent,
  useCallback,
  useId,
  useRef,
} from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Composed from the official primitives; runtime and persistence stay outside this UI.
// https://www.assistant-ui.com/docs/primitives/thread
// https://www.assistant-ui.com/docs/primitives/composer

const suggestedQuestions = [
  "长期持有一家公司，应该持续关注哪些变化？",
  "研究半导体行业，可以从哪些指标开始？",
  "阅读一份财报，如何区分事实与投资判断？",
] as const;

function preventSubmission(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
}

function ThreadWelcome({
  onSelectQuestion,
}: {
  onSelectQuestion: (question: string) => void;
}) {
  const selectQuestion = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      onSelectQuestion(event.currentTarget.value);
    },
    [onSelectQuestion]
  );

  return (
    <div className="flex flex-1 flex-col justify-center py-12 sm:py-16">
      <div className="border-border bg-secondary mb-7 flex size-12 items-center justify-center rounded-xl border">
        <BookOpen aria-hidden="true" className="size-5" strokeWidth={1.5} />
      </div>
      <p className="text-muted-foreground mb-4 font-mono text-xs tracking-[0.14em]">
        MILO / INVESTMENT COMPANION
      </p>
      <h1 className="max-w-xl text-2xl leading-relaxed font-medium tracking-tight text-balance sm:text-3xl">
        你好，今天想聊什么投资问题？
      </h1>
      <p className="text-muted-foreground mt-4 max-w-lg text-sm leading-7 sm:text-base">
        关于公司、行业，或长期投资的思考。
        <br />
        先写下你的问题，为下一次研究理清思路。
      </p>
      <div className="mt-9 grid gap-2">
        <p className="text-muted-foreground mb-1 text-xs">
          选择一个问题，填入草稿
        </p>
        {suggestedQuestions.map((question) => (
          <Button
            className="hover:border-border h-auto min-h-12 justify-between gap-4 rounded-lg border border-transparent px-3 py-3 text-left text-sm leading-6 font-normal whitespace-normal"
            key={question}
            onClick={selectQuestion}
            type="button"
            value={question}
            variant="ghost"
          >
            <span>{question}</span>
            <ArrowUpRight
              aria-hidden="true"
              className="text-muted-foreground size-4"
              strokeWidth={1.5}
            />
          </Button>
        ))}
      </div>
    </div>
  );
}

function MarkdownText() {
  return (
    <MarkdownTextPrimitive
      className={cn(
        "min-w-0 text-sm leading-7 wrap-anywhere sm:text-base",
        "[&_a:focus-visible]:outline-ring [&_a]:underline [&_a]:underline-offset-4 [&_a:focus-visible]:outline-2",
        "[&_blockquote]:border-border [&_blockquote]:text-muted-foreground [&_blockquote]:my-4 [&_blockquote]:border-l-2 [&_blockquote]:pl-4",
        "[&_h1]:mt-6 [&_h1]:mb-3 [&_h1]:text-xl [&_h1]:font-medium [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-medium",
        "[&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:font-medium [&_li]:my-1 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6",
        "[&_pre]:bg-secondary [&_p]:my-3 [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:p-4 [&_pre]:text-xs",
        "[&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6 [&>:first-child]:mt-0 [&>:last-child]:mb-0"
      )}
      skipHtml
      smooth={false}
    />
  );
}

function ToolFallback({
  isError,
  result,
  status,
  toolName,
}: ToolCallMessagePartProps<Record<string, unknown>, unknown>) {
  let statusLabel = "处理中";
  if (status.type === "complete") {
    statusLabel = result === undefined ? "已结束，未返回结果" : "已返回结果";
  } else if (status.type === "requires-action") {
    statusLabel = "等待确认";
  } else if (status.type === "incomplete") {
    statusLabel = "未完成";
  }
  if (isError) {
    statusLabel = "处理失败";
  }

  return (
    <details className="bg-secondary/50 my-3 rounded-lg border text-sm">
      <summary className="focus-visible:outline-ring min-h-11 cursor-pointer rounded-lg px-4 py-3 focus-visible:outline-2 focus-visible:outline-offset-2">
        查询步骤 · {statusLabel}
      </summary>
      <div className="text-muted-foreground border-t px-4 py-3">
        <p className="font-mono text-xs wrap-anywhere">{toolName}</p>
        <p className="mt-2 leading-6">
          {isError
            ? "这一步暂未取得可用结果。"
            : "此处展示调用状态，具体资料与结论以回复中的说明为准。"}
        </p>
      </div>
    </details>
  );
}

function UserMessage() {
  return (
    <MessagePrimitive.Root className="flex justify-end py-4">
      <div className="bg-secondary max-w-[90%] rounded-2xl px-5 py-3 text-sm leading-7 sm:max-w-[85%] sm:text-base">
        <span className="sr-only">你：</span>
        <MessagePrimitive.Parts />
      </div>
    </MessagePrimitive.Root>
  );
}

function AssistantMessage() {
  return (
    <MessagePrimitive.Root className="min-w-0 py-5">
      <p className="text-muted-foreground mb-3 font-mono text-xs tracking-wider">
        MILO
      </p>
      <MessagePrimitive.Parts>
        {({ part }) => {
          if (part.type === "text") {
            return <MarkdownText />;
          }
          if (part.type === "tool-call") {
            return part.toolUI ?? <ToolFallback {...part} />;
          }
          return null;
        }}
      </MessagePrimitive.Parts>
      <MessagePrimitive.Error>
        <ErrorPrimitive.Root className="border-destructive/30 bg-destructive/5 text-destructive mt-4 flex items-start gap-2 rounded-lg border p-3 text-sm">
          <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <ErrorPrimitive.Message>
            暂时未能完成这次回复，请稍后重试。
          </ErrorPrimitive.Message>
        </ErrorPrimitive.Root>
      </MessagePrimitive.Error>
    </MessagePrimitive.Root>
  );
}

export function MiloThread({ className }: { className?: string }) {
  const aui = useAui();
  const isEmpty = useAuiState((state) => state.thread.isEmpty);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const inputId = useId();
  const descriptionId = useId();

  const prepareQuestion = useCallback(
    (question: string) => {
      aui.composer.setText(question);
      inputRef.current?.focus();
    },
    [aui]
  );

  return (
    <ThreadPrimitive.Root
      className={cn("flex min-h-0 flex-1 flex-col", className)}
    >
      <ThreadPrimitive.Viewport
        className="flex min-h-0 flex-1 flex-col overflow-y-auto px-1"
        turnAnchor="top"
      >
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col">
          {isEmpty && <ThreadWelcome onSelectQuestion={prepareQuestion} />}
          <ThreadPrimitive.Messages>
            {({ message }) => {
              if (message.role === "user") {
                return <UserMessage />;
              }
              if (message.role === "assistant") {
                return <AssistantMessage />;
              }
              return null;
            }}
          </ThreadPrimitive.Messages>
          {!isEmpty && (
            <div className="flex justify-center py-3">
              <ThreadPrimitive.ScrollToBottom asChild>
                <Button className="min-h-11" type="button" variant="outline">
                  <ArrowDown aria-hidden="true" className="size-4" />
                  回到最新消息
                </Button>
              </ThreadPrimitive.ScrollToBottom>
            </div>
          )}
        </div>
      </ThreadPrimitive.Viewport>

      <div className="mx-auto w-full max-w-3xl shrink-0 pt-5 pb-5 sm:pb-7">
        <label
          className="text-muted-foreground mb-3 block text-xs"
          htmlFor={inputId}
        >
          你的问题草稿
        </label>
        <ComposerPrimitive.Root
          className="border-input bg-background focus-within:border-ring focus-within:ring-ring rounded-2xl border p-3 focus-within:ring-1"
          onSubmit={preventSubmission}
        >
          <ComposerPrimitive.Input
            addAttachmentOnPaste={false}
            aria-describedby={descriptionId}
            className="placeholder:text-muted-foreground max-h-48 min-h-20 w-full resize-none bg-transparent px-2 py-2 text-base leading-7 outline-none"
            id={inputId}
            placeholder="写下你想研究的公司、行业或投资问题…"
            ref={inputRef}
            rows={2}
            submitMode="none"
          />
          <div className="flex items-center justify-between gap-3 pt-2">
            <span className="text-muted-foreground px-2 text-xs">
              聊天服务尚未开放
            </span>
            <ComposerPrimitive.Send asChild disabled>
              <Button
                aria-label="发送暂不可用"
                className="size-11"
                disabled
                size="icon"
              >
                <ArrowUp aria-hidden="true" className="size-4" />
              </Button>
            </ComposerPrimitive.Send>
          </div>
        </ComposerPrimitive.Root>
        <p
          className="text-muted-foreground mt-3 text-xs leading-5"
          id={descriptionId}
        >
          现在可以编辑草稿，暂不发送。草稿仅保留在当前页面，刷新或离开后会丢失。
        </p>
      </div>
    </ThreadPrimitive.Root>
  );
}
