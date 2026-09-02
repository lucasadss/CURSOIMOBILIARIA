"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CopyButton({
  value,
  label = "Copiar",
  className,
  variant = "secondary",
  size = "sm",
  onCopied,
}: {
  value: string;
  label?: string;
  className?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  onCopied?: () => void;
}) {
  const [copied, setCopied] = React.useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      /* clipboard unavailable — noop */
    }
    setCopied(true);
    onCopied?.();
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={copy}
      className={cn(className)}
      aria-live="polite"
    >
      {copied ? <Check className="text-positive" /> : <Copy />}
      {copied ? "Copiado" : label}
    </Button>
  );
}
