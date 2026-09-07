"use client";

import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface DisclosureProps {
  trigger: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

/**
 * Replaces the seven near-duplicate xTogglePopup() functions found in the old
 * script.js (see migration plan's shared-components note). Used for comment
 * thread expansion, FAQ-style content, and any other expand/collapse pattern —
 * one implementation instead of one per feature.
 */
export function Disclosure({ trigger, children, defaultOpen = false, className }: DisclosureProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen} className={className}>
      <Collapsible.Trigger className="flex w-full items-center justify-between gap-2 py-2 text-left text-sm font-medium text-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
        {trigger}
        <ChevronDown
          size={16}
          className={cn("shrink-0 text-stone-600 transition-transform", open && "rotate-180")}
          aria-hidden="true"
        />
      </Collapsible.Trigger>
      <Collapsible.Content className="overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out">
        {children}
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
