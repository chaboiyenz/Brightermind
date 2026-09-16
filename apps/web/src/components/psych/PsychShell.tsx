"use client";

import { useState, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { PsychSidebar } from "./PsychSidebar";
import { PsychTopbar } from "./PsychTopbar";

// The psychologist workspace (docs/role-based-system-plan.md §5): a fixed
// sidebar beside a scrolling content column with its own top bar. Used for
// every route a psychologist visits — /psych/* and the shared ones
// (/messages, /call, /community, /coping) — so the workspace never falls
// back to the marketing chrome. Below lg the sidebar becomes a drawer opened
// from the top bar (Radix Dialog for focus trap and escape-to-close).
export function PsychShell({ children }: { children: ReactNode }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-stone-50">
      <div className="sticky top-0 hidden h-screen lg:block">
        <PsychSidebar />
      </div>

      <Dialog.Root open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-stone-800/25 backdrop-blur-[4px] lg:hidden" />
          <Dialog.Content className="fixed inset-y-0 left-0 z-50 h-full focus:outline-none lg:hidden">
            <Dialog.Title className="sr-only">Workspace menu</Dialog.Title>
            <PsychSidebar className="shadow-float" onNavigate={() => setIsDrawerOpen(false)} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <div className="flex min-w-0 flex-1 flex-col">
        <PsychTopbar onOpenMenu={() => setIsDrawerOpen(true)} />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
