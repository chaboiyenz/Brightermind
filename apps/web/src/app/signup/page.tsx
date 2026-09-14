import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui";
import { SignupForm } from "./SignupForm";

// Centered Card auth layout (design pass — logic untouched, see SignupForm).
// MinimalSiteHeader already handles the logo-only header for this route via
// SiteChrome.
export default function SignupPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-gradient-to-b from-brand-50 to-stone-50 px-4 py-16 sm:px-6">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="mb-5 flex-col items-start gap-1">
            <CardTitle className="text-xl">Create your account</CardTitle>
            <p className="text-sm text-stone-600">
              Free for students — takes about a minute.
            </p>
          </CardHeader>
          <SignupForm />
          <div className="mt-6 space-y-2 text-center text-sm text-stone-600">
            <p>
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-brand-600 hover:text-brand-700"
              >
                Log in
              </Link>
            </p>
            <p>
              Are you a psychologist?{" "}
              <Link
                href="/signup/psychologist"
                className="font-medium text-brand-600 hover:text-brand-700"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </main>
  );
}
