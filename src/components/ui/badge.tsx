import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "default" | "success" | "warning" | "danger";

const tones: Record<BadgeTone, string> = {
  danger: "bg-red-500/10 text-red-700 ring-red-500/20 dark:text-red-300",
  default: "bg-slate-500/10 text-slate-700 ring-slate-500/20 dark:text-slate-200",
  success: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-300",
  warning: "bg-orange-500/10 text-orange-700 ring-orange-500/20 dark:text-orange-300",
};

export function Badge({
  className,
  tone = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-full px-2.5 text-xs font-medium ring-1 ring-inset",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
