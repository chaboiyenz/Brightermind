"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button, FormField, Input } from "@/components/ui";
import { login } from "@/lib/api";
import { isMockMode } from "@/lib/mock/mockMode";
import { homeFor } from "@/lib/session/access";

// Real-API login (Phase 3, PR #45), now the collapsed fallback under the
// prototype role cards on /login. The old mock-mode role dropdown was
// retired: RoleEntryCards is the one prototype entry point.
export function LoginForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const user = await login({ username, password });
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      router.push(homeFor(user.role));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      {isMockMode() && (
        <p className="text-sm text-stone-600">
          Prototype mode: no backend is running, so this form cannot sign anyone in yet. Use
          the role cards above.
        </p>
      )}
      <FormField label="Username" htmlFor="username">
        <Input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
        />
      </FormField>
      <FormField label="Password" htmlFor="password">
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
      </FormField>
      {error && (
        <p className="text-sm text-brick-600" role="alert">
          {error}
        </p>
      )}
      <Button type="submit" disabled={isSubmitting} isLoading={isSubmitting} className="w-full">
        Log in
      </Button>
    </form>
  );
}
