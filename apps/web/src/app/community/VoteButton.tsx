"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/components/ui";

export interface VoteButtonProps {
  targetId: number;
  targetType: "post" | "comment";
  votes: number;
  size?: "sm" | "md";
}

// REDESIGN (module 10): a single toggleable "support" reaction instead of
// Reddit-style up/down arrows with a score — the migration plan's `direction`
// prop is intentionally dropped. Local optimistic state only: nothing is
// POSTed, nothing persists across reload, and there is no per-user dedupe.
// That dedupe is server-side work tracked separately; when it lands, the real
// mutation goes where `toggle` flips state and must be ready to revert.
export function VoteButton({ targetId, targetType, votes, size = "md" }: VoteButtonProps) {
  const [isSupported, setIsSupported] = useState(false);
  const count = votes + (isSupported ? 1 : 0);
  const countLabel = `${count} ${count === 1 ? "person supports" : "people support"} this ${targetType}`;

  function toggle() {
    setIsSupported((current) => !current);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isSupported}
      // aria-label replaces the visible text as the accessible name, so the
      // count has to be part of it or assistive tech never hears it.
      aria-label={`${isSupported ? "Remove your support" : "Support"} — ${countLabel}`}
      data-target-id={targetId}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
        size === "md" ? "px-3 py-1.5 text-sm" : "px-2.5 py-1 text-xs",
        isSupported
          ? "border-clay-100 bg-clay-50 text-clay-600"
          : "border-stone-200 bg-stone-25 text-stone-700 hover:border-clay-100 hover:bg-clay-50 hover:text-clay-600"
      )}
    >
      <Heart
        className={cn(
          size === "md" ? "h-4 w-4" : "h-3.5 w-3.5",
          "transition-transform",
          isSupported && "scale-110 fill-current"
        )}
        aria-hidden="true"
      />
      <span className="tabular-nums" aria-hidden="true">
        {count}
      </span>
    </button>
  );
}
