"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button, FormField, Input, Textarea } from "@/components/ui";
import { registerPsychologist, type RegisterPsychologistInput } from "@/lib/api";

const initialValues: RegisterPsychologistInput = {
  username: "",
  first_name: "",
  last_name: "",
  email: "",
  password1: "",
  password2: "",
  license_number: "",
  qualification: "",
  years_of_experience: 0,
  area_of_expertise: "",
  contact_number: "",
  bio: "",
};

export function PsychologistSignupForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [values, setValues] = useState<RegisterPsychologistInput>(initialValues);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function update(field: keyof RegisterPsychologistInput) {
    return (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((current) => ({
        ...current,
        [field]: field === "years_of_experience" ? Number(e.target.value) : e.target.value,
      }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await registerPsychologist(values);
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      // A newly-registered psychologist starts unapproved (Phase 4 builds
      // the approval workflow) — send them somewhere that says so rather
      // than straight into a page that assumes approved status.
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
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
        <Input id="email" type="email" value={values.email} onChange={update("email")} required />
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
      <FormField label="License number" htmlFor="license_number">
        <Input
          id="license_number"
          value={values.license_number}
          onChange={update("license_number")}
          required
        />
      </FormField>
      <FormField label="Qualification" htmlFor="qualification">
        <Input
          id="qualification"
          value={values.qualification}
          onChange={update("qualification")}
          required
        />
      </FormField>
      <FormField label="Years of experience" htmlFor="years_of_experience">
        <Input
          id="years_of_experience"
          type="number"
          min={0}
          value={values.years_of_experience}
          onChange={update("years_of_experience")}
          required
        />
      </FormField>
      <FormField label="Area of expertise" htmlFor="area_of_expertise">
        <Input
          id="area_of_expertise"
          value={values.area_of_expertise}
          onChange={update("area_of_expertise")}
          required
        />
      </FormField>
      <FormField label="Contact number" htmlFor="contact_number">
        <Input
          id="contact_number"
          value={values.contact_number}
          onChange={update("contact_number")}
          required
        />
      </FormField>
      <FormField label="Bio (optional)" htmlFor="bio">
        <Textarea id="bio" value={values.bio} onChange={update("bio")} />
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
