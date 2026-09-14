import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui";
import { isMockMode } from "@/lib/mock/mockMode";
import { LoginForm } from "./LoginForm";
import { GoogleLoginButton } from "./GoogleLoginButton";

// Centered Card auth layout (design pass — logic untouched, see LoginForm).
// MinimalSiteHeader already handles the logo-only header for this route via
// SiteChrome; this page only owns the content between it and the (absent,
// by the same SiteChrome decision) footer.
export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-gradient-to-b from-brand-50 to-stone-50 px-4 py-16 sm:px-6">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="mb-5 flex-col items-start gap-1">
            <CardTitle className="text-xl">Welcome back</CardTitle>
            <p className="text-sm text-stone-600">
              Log in to pick up where you left off.
            </p>
          </CardHeader>
          <LoginForm />
          {isMockMode() && (
            <>
              <div className="my-5 flex items-center gap-3" aria-hidden="true">
                <div className="h-px flex-1 bg-stone-200" />
                <span className="text-xs uppercase tracking-wide text-stone-600">
                  or
                </span>
                <div className="h-px flex-1 bg-stone-200" />
              </div>
              <GoogleLoginButton />
              <p className="mt-2 text-center text-xs text-stone-600">
                Prototype mode — not a real Google sign-in.
              </p>
            </>
          )}
          <p className="mt-6 text-center text-sm text-stone-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-brand-600 hover:text-brand-700"
            >
              Sign up
            </Link>
          </p>
        </Card>
      </div>
    </main>
  );
}
