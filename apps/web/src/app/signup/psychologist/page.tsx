import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui";
import { PsychologistSignupForm } from "./PsychologistSignupForm";

// Centered Card auth layout (design pass — logic untouched, see
// PsychologistSignupForm). Longer form than /login and /signup, so the Card
// widens to max-w-md (matches the form's own existing max-w-md) and the
// fields are visually grouped into "Personal info"/"Professional info"
// inside the form itself rather than introducing a multi-step wizard.
export default function PsychologistSignupPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-gradient-to-b from-brand-50 to-stone-50 px-4 py-16 sm:px-6">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="mb-5 flex-col items-start gap-1">
            <CardTitle className="text-xl">Join as a psychologist</CardTitle>
            <p className="text-sm text-stone-600">
              Applications are reviewed before your profile goes live.
            </p>
          </CardHeader>
          <PsychologistSignupForm />
          <p className="mt-6 text-center text-sm text-stone-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-brand-600 hover:text-brand-700"
            >
              Log in
            </Link>
          </p>
        </Card>
      </div>
    </main>
  );
}
