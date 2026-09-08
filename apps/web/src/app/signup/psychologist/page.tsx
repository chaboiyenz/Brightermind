import { PsychologistSignupForm } from "./PsychologistSignupForm";

export default function PsychologistSignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 p-6">
      <div className="w-full max-w-md">
        <h1 className="mb-6 text-lg font-medium text-stone-900">Psychologist sign up</h1>
        <PsychologistSignupForm />
      </div>
    </main>
  );
}
