"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button, FormField, Input } from "@/components/ui";
import { registerStudent, type RegisterStudentInput } from "@/lib/api";
import { isMockMode } from "@/lib/mock/mockMode";
import { useMockRole } from "@/components/MockRoleProvider";

// Mock-mode retrofit (decision (b), docs/prototype-roadmap.md) — this route
// is specifically the *student* signup, so there's no role to choose (unlike
// /login): mock mode just sets the role to "student" and moves on. Matches
// LoginForm's pattern of picking between the two forms below rather than
// branching mid-component, so real-mode JSX stays untouched.
export function SignupForm() {
  if (isMockMode()) return <MockSignupForm />;
  return <RealSignupForm />;
}

// No form fields, no real account — purely a role-selection stand-in for
// "being signed up", reusing MockRoleProvider's role state (useMockRole)
// rather than a second mock-auth mechanism. Redirects to /mood, matching
// exactly where a real successful student signup sends the user (see
// RealSignupForm below).
function MockSignupForm() {
  const router = useRouter();
  const { setRole } = useMockRole();

  function handleContinue() {
    setRole("student");
    router.push("/mood");
  }

  return (
    <div className="w-full max-w-sm space-y-4">
      <p className="text-sm text-stone-600">
        Prototype mode — no backend running. Continuing previews the app as a
        student; nothing here is actually registered.
      </p>
      <Button onClick={handleContinue}>Continue as a student</Button>
    </div>
  );
}

const initialValues: RegisterStudentInput = {
  username: "",
  first_name: "",
  last_name: "",
  email: "",
  password1: "",
  password2: "",
};

// Unchanged real-API behavior (Phase 3, PR #45).
function RealSignupForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [values, setValues] = useState<RegisterStudentInput>(initialValues);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function update(field: keyof RegisterStudentInput) {
    return (e: ChangeEvent<HTMLInputElement>) =>
      setValues((current) => ({ ...current, [field]: e.target.value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await registerStudent(values);
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      router.push("/mood");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <FormField label="Username" htmlFor="username">
        <Input id="username" value={values.username} onChange={update("username")} required />
      </FormField>
      <FormField label="First name" htmlFor="first_name">
        <Input id="first_name" value={values.first_name} onChange={update("first_name")} required />
      </FormField>
      <FormField label="Last name" htmlFor="last_name">
        <Input id="last_name" value={values.last_name} onChange={update("last_name")} required />
      </FormField>
      <FormField label="Email" htmlFor="email">
        <Input
          id="email"
          type="email"
          value={values.email}
          onChange={update("email")}
          required
        />
      </FormField>
      <FormField label="Password" htmlFor="password1">
        <Input
          id="password1"
          type="password"
          value={values.password1}
          onChange={update("password1")}
          required
        />
      </FormField>
      <FormField label="Confirm password" htmlFor="password2">
        <Input
          id="password2"
          type="password"
          value={values.password2}
          onChange={update("password2")}
          required
        />
      </FormField>
      {error && (
        <p className="text-sm text-brick-600" role="alert">
          {error}
        </p>
      )}
      <Button type="submit" disabled={isSubmitting} isLoading={isSubmitting} className="w-full">
        Sign up
      </Button>
    </form>
  );
}
