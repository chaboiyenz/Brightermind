"use client";

// TEMPORARY dev-only login page — pairs with apps/api's /api/v2/auth/dev-login/.
// Not linked from any nav. Remove alongside that endpoint once Phase 3 ships
// the real login/signup flow (see docs/roadmap.md Phase 3).

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button, FormField, Input } from "@/components/ui";
import { devLogin } from "@/lib/api";

export default function DevLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await devLogin({ username, password });
      router.push("/mood");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-lg font-medium text-stone-900">Dev login (temporary)</h1>
        <FormField label="Username" htmlFor="username">
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </FormField>
        <FormField label="Password" htmlFor="password">
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormField>
        {error && <p className="text-sm text-brick-600">{error}</p>}
        <Button type="submit" disabled={isSubmitting} isLoading={isSubmitting}>
          Log in
        </Button>
      </form>
    </main>
  );
}
