"use client";

// Client component deliberately — fetches after mount rather than during
// the server render/build, so `next build` never depends on apps/api being
// reachable at build time.

import { useEffect, useState } from "react";
import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { fetchHealth } from "@/lib/api";

type Status = { state: "loading" } | { state: "ok" } | { state: "error"; message: string };

export function ApiStatus() {
  const [status, setStatus] = useState<Status>({ state: "loading" });

  useEffect(() => {
    let cancelled = false;

    fetchHealth()
      .then(() => {
        if (!cancelled) setStatus({ state: "ok" });
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          const message = error instanceof Error ? error.message : "Unknown error";
          setStatus({ state: "error", message });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>API connection</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-2">
        {status.state === "loading" && <Badge tone="neutral">Checking…</Badge>}
        {status.state === "ok" && <Badge tone="success">Connected</Badge>}
        {status.state === "error" && (
          <>
            <Badge tone="danger">Unreachable</Badge>
            <span className="text-xs text-stone-600">{status.message}</span>
          </>
        )}
      </CardContent>
    </Card>
  );
}
