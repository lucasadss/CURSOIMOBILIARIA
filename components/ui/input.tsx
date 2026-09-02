import * as React from "react";
import { cn } from "@/lib/utils";

const base =
  "w-full rounded-md border border-hairline-strong bg-panel-2 text-sm text-ink placeholder:text-ink-faint transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-1px] focus-visible:outline-brand disabled:opacity-50";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type = "text", ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(base, "h-9 px-3", className)}
    {...props}
  />
));
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, rows = 3, ...props }, ref) => (
  <textarea
    ref={ref}
    rows={rows}
    className={cn(base, "resize-y px-3 py-2 leading-relaxed", className)}
    {...props}
  />
));
Textarea.displayName = "Textarea";
