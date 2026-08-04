import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-xl border border-[var(--color-border)] bg-white px-3.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-navy/40 focus:ring-2 focus:ring-navy/15",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
