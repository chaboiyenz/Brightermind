"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button, FormField, Input } from "@/components/ui";
import { registerStudent, type RegisterStudentInput } from "@/lib/api";

const initialValues: RegisterStudentInput = {
  username: "",
  first_name: "",
  last_name: "",
  email: "",
  password1: "",
  password2: "",
};

export function SignupForm() {
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
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
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
      <Button type="submit" disabled={isSubmitting} isLoading={isSubmitting}>
        Sign up
      </Button>
    </form>
  );
}
