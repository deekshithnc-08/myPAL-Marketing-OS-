import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 text-sm font-medium transition hover:translate-y-[-1px] disabled:pointer-events-none disabled:opacity-50",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "h-10 px-4",
        icon: "h-10 w-10 px-0",
        sm: "h-8 px-3 text-xs",
      },
      variant: {
        default: "bg-[var(--brand)] text-white shadow-lg shadow-orange-500/20 hover:bg-[var(--brand-strong)]",
        ghost: "text-slate-700 hover:bg-slate-950/5 dark:text-slate-200 dark:hover:bg-white/8",
        outline: "border border-[var(--border)] bg-white/50 text-slate-800 hover:bg-white dark:bg-white/5 dark:text-slate-100",
        secondary: "bg-slate-900 text-white hover:bg-slate-700 dark:bg-white dark:text-slate-950",
      },
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, size, variant, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ className, size, variant }))} {...props} />;
}
