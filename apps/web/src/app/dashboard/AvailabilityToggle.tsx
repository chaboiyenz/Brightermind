"use client";

import { useState } from "react";
import { Badge, Button } from "@/components/ui";

export type AvailabilityStatus = "available" | "unavailable";

const NEXT_STATUS: Record<AvailabilityStatus, AvailabilityStatus> = {
  available: "unavailable",
  unavailable: "available",
};

/**
 * Client component (module 12) — owns `status` as immediate local state.
 * Prototype pivot: no PATCH /api/v2/psychologists/me/availability/, so the
 * value is not persisted and resets on refresh. That is expected. When wired
 * for real, this should read/write ONE current-status field, not "the latest
 * of many log rows" (see the migration plan's note on v1's .latest() model).
 */
export function AvailabilityToggle({
  initialStatus = "available",
}: {
  initialStatus?: AvailabilityStatus;
}) {
  const [status, setStatus] = useState<AvailabilityStatus>(initialStatus);
  const isAvailable = status === "available";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="text-sm text-stone-700">You are currently</span>
        <Badge tone={isAvailable ? "success" : "neutral"} aria-live="polite">
          {isAvailable ? "Available" : "Unavailable"}
        </Badge>
      </div>
      <Button
        variant="outline"
        size="sm"
        aria-pressed={isAvailable}
        onClick={() => setStatus((current) => NEXT_STATUS[current])}
      >
        {isAvailable ? "Mark as unavailable" : "Mark as available"}
      </Button>
      <p className="basis-full text-xs text-stone-600">
        Students see this on the psychologist directory. Prototype note: this
        resets on refresh — nothing is saved yet.
      </p>
    </div>
  );
}
