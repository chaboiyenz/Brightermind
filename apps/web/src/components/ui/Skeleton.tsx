import { type HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

/**
 * Base skeleton block. Compose into shapes (SkeletonText, SkeletonCard, etc.)
 * per-page rather than building every loading state from scratch — see the
 * migration plan's per-module "Loading:" notes for what shape each page needs
 * (skeleton calendar grid, skeleton table rows, skeleton post cards, etc.).
 */
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-sm bg-stone-200", className)}
      aria-hidden="true"
      {...props}
    />
  );
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-2", className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={cn("h-3", i === lines - 1 ? "w-2/3" : "w-full")} />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-lg border border-stone-200 p-5", className)}>
      <Skeleton className="mb-3 h-5 w-1/3" />
      <SkeletonText lines={2} />
    </div>
  );
}
