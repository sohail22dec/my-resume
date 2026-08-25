import * as React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive" | "subtle";
  size?: "default" | "sm" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variantStyles = {
      default:
        "bg-zinc-900 text-zinc-50 hover:bg-zinc-800 shadow-xs active:scale-[0.98]",
      secondary:
        "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 active:scale-[0.98]",
      outline:
        "border border-zinc-200 bg-white hover:bg-zinc-100/80 text-zinc-800 shadow-2xs active:scale-[0.98]",
      ghost:
        "hover:bg-zinc-100 text-zinc-700 hover:text-zinc-900",
      destructive:
        "bg-red-600 text-white hover:bg-red-700 shadow-xs active:scale-[0.98]",
      subtle:
        "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 shadow-2xs active:scale-[0.98]",
    };

    const sizeStyles = {
      default: "h-9 px-4 py-2 text-xs font-semibold rounded-lg",
      sm: "h-8 px-2.5 py-1.5 text-xs font-semibold rounded-lg",
      lg: "h-10 px-5 py-2.5 text-sm font-bold rounded-xl",
      icon: "h-8 w-8 p-1 rounded-lg flex items-center justify-center",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-1.5 whitespace-nowrap transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
