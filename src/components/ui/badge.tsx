import * as React from "react";
import { cn } from "../../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "ai";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "border-transparent bg-zinc-900 text-zinc-50 shadow-xs",
    secondary: "border-transparent bg-zinc-100 text-zinc-900",
    outline: "text-zinc-800 border-zinc-200 bg-white shadow-2xs",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700 font-semibold",
    ai: "border-purple-200 bg-purple-50 text-purple-700 font-semibold",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 select-none",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
