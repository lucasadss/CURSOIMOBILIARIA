import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NativeSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  placeholder?: string;
}

/**
 * Styled native <select>. Reliable, accessible, keyboard-native — and reads as
 * a quiet form control rather than a flashy custom dropdown.
 */
export const Select = React.forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ className, children, placeholder, value, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        value={value}
        className={cn(
          "h-9 w-full appearance-none rounded-md border border-hairline-strong bg-panel-2 pl-3 pr-9 text-sm text-ink transition-colors",
          "focus-visible:outline-2 focus-visible:outline-offset-[-1px] focus-visible:outline-brand",
          "disabled:opacity-50 [&>option]:bg-panel-2 [&>option]:text-ink",
          (value === undefined || value === "") && "text-ink-faint",
          className,
        )}
        {...props}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-faint" />
    </div>
  ),
);
Select.displayName = "Select";
