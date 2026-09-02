"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Drawer = DialogPrimitive.Root;
export const DrawerTrigger = DialogPrimitive.Trigger;
export const DrawerClose = DialogPrimitive.Close;

export const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    side?: "right" | "left";
    title?: string;
    description?: string;
  }
>(({ className, children, side = "right", title, description, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/55 backdrop-blur-[2px] data-[state=open]:animate-fade" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-y-0 z-50 flex w-[min(30rem,calc(100vw-2.5rem))] flex-col border-hairline-strong bg-panel shadow-[var(--shadow-pop)] transition-transform",
        side === "right"
          ? "right-0 border-l data-[state=open]:animate-[ii-slide-in-right_0.28s_var(--ease-out)]"
          : "left-0 border-r data-[state=open]:animate-[ii-slide-in-left_0.28s_var(--ease-out)]",
        className,
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-4 border-b border-hairline px-5 py-4">
        <div className="space-y-0.5">
          {title && (
            <DialogPrimitive.Title className="text-md font-medium text-ink">
              {title}
            </DialogPrimitive.Title>
          )}
          {description && (
            <DialogPrimitive.Description className="text-sm text-ink-muted">
              {description}
            </DialogPrimitive.Description>
          )}
        </div>
        <DialogPrimitive.Close className="-mr-1 rounded-sm p-1 text-ink-faint transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-brand">
          <X className="size-4" />
          <span className="sr-only">Fechar</span>
        </DialogPrimitive.Close>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
DrawerContent.displayName = "DrawerContent";
