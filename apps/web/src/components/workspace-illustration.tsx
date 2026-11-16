import { DotPattern } from "@/components/magicui/dot-pattern";

export function WorkspaceIllustration() {
  return (
    <div
      aria-hidden="true"
      className="relative grid h-36 w-52 place-items-center overflow-hidden"
    >
      <DotPattern
        className="text-foreground/10 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
        cr={0.8}
        height={20}
        width={20}
      />
      <svg
        aria-hidden="true"
        className="text-foreground relative h-[105px] w-[120px]"
        fill="none"
        focusable="false"
        strokeWidth={1.2}
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
    </div>
  );
}
