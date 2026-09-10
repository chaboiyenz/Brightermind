"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui";

// Mocked OAuth — there's no real Google integration wired up yet, so this
// never appears outside mock mode (see the isMockMode() check in page.tsx);
// a real-backend login page must never show a button that can't actually
// authenticate anything. Redirects to /mood, matching exactly where a real
// successful login sends the user (see LoginForm).
export function GoogleLoginButton() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleClick() {
    setIsSubmitting(true);
    // No real OAuth round-trip to await — a short delay keeps the
    // interaction feeling real, then land wherever a successful login lands.
    setTimeout(() => {
      router.push("/mood");
    }, 400);
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      isLoading={isSubmitting}
      onClick={handleClick}
    >
      Continue with Google
    </Button>
  );
}
