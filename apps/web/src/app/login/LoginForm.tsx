"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button, FormField, Input, type Role } from "@/components/ui";
import { login } from "@/lib/api";
import { isMockMode } from "@/lib/mock/mockMode";
import { MOCK_ROLES, useMockRole } from "@/components/MockRoleProvider";

// Mock-mode retrofit (decision (b), docs/prototype-roadmap.md) — auth is
// static/mocked too, not just the content pages. Picks between the two
// forms below rather than branching mid-component, so the real-mode JSX
// stays byte-for-byte what it was before this retrofit.
export function LoginForm() {
  if (isMockMode()) return <MockLoginForm />;
  return <RealLoginForm />;
}

// No password, no username, no real session/token — purely a role-selection
// stand-in for "being logged in", reusing MockRoleProvider's own role state
// (via useMockRole) rather than a second mock-auth mechanism. Redirects to
// /mood, matching exactly where a real successful login sends the user
// (see RealLoginForm below).
function MockLoginForm() {
  const router = useRouter();
  const { role, setRole } = useMockRole();
  const [selected, setSelected] = useState<Role>(role);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setRole(selected);
    router.push("/mood");
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <p className="text-sm text-stone-600">
        Prototype mode — no backend running. Pick a role to preview the app as
        that user; nothing else here is checked.
      </p>
      <FormField label="Log in as" htmlFor="mock-role">
        <select
          id="mock-role"
          value={selected}
          onChange={(e) => setSelected(e.target.value as Role)}
          className="w-full rounded-sm border border-stone-300 bg-stone-25 px-3 py-2 text-sm text-stone-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          {MOCK_ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </FormField>
      <Button type="submit" className="w-full">
        Log in
      </Button>
    </form>
  );
}

// Unchanged real-API behavior (Phase 3, PR #45).
function RealLoginForm() {
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
      await login({ username, password });
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      router.push("/mood");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
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
