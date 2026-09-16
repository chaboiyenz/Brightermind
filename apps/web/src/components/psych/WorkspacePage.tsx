import type { ReactNode } from "react";
import { Card, cn } from "@/components/ui";

// Shared layout pieces for the psychologist workspace pages so every /psych
// route has the same rhythm: a 28/32px padded column on the linen canvas, a
// heading row with optional actions, and DESIGN.md cards.

export function WorkspacePage({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <main className={cn("mx-auto flex w-full max-w-[1240px] flex-col gap-6 px-4 py-7 sm:px-8", className)}>
      {children}
    </main>
  );
}

export function WorkspaceHeading({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div className="grid gap-1">
        <h2 className="font-display text-headline-md text-stone-900">{title}</h2>
        {description && <p className="text-sm text-stone-600">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

export function StatTile({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <Card className="grid gap-1.5 p-5">
      <p className="text-xs uppercase tracking-[0.04em] text-stone-600">{label}</p>
      <p className="font-display text-[28px] font-medium leading-[34px] text-stone-900">{value}</p>
      {hint && <p className="text-sm text-stone-600">{hint}</p>}
    </Card>
  );
}

export function SectionCard({
  title,
  action,
  children,
  className,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-base font-medium text-stone-900">{title}</h3>
        {action}
      </div>
      {children}
    </Card>
  );
}
