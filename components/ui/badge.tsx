import type { HTMLAttributes } from "react";

type BadgeProps = HTMLAttributes<HTMLDivElement>;

export function Badge({ className = "", ...props }: BadgeProps) {
  return (
    <div
      className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors ${className}`.trim()}
      {...props}
    />
  );
}

