"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui";

// router.back() does nothing gracefully when there's no browser history to
// go back to (a direct URL visit, or a page opened in a fresh tab) — in that
// case window.history.length is 1 (just this entry), so fall back to home
// instead of a dead button.
export function BackButton() {
  const router = useRouter();

  function handleBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleBack} aria-label="Go back">
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      Back
    </Button>
  );
}
