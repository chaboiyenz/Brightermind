import Link from "next/link";
import { Suspense } from "react";
import { Disclosure } from "@/components/ui";
import { Eyebrow } from "@/components/home/SectionHeading";
import { LoginForm } from "./LoginForm";
import { RoleEntryCards } from "./RoleEntryCards";

// Prototype sign-in (docs/role-based-system-plan.md §1). The landing page
// stays as it is; any feature it links to sends a guest here, and the two
// role cards take them straight into the patient or psychologist shell. The
// real email/password form is kept, collapsed, so wiring real auth later is
// a matter of removing the cards, not rebuilding the page.
//
// MinimalSiteHeader is rendered by SiteChrome for this route; the page owns
// only the content beneath it.
export default function LoginPage() {
  return (
    <main
      className="flex flex-1 flex-col items-center justify-center gap-10 px-5 py-14 sm:px-10"
      style={{
        background:
          "linear-gradient(180deg, rgb(var(--brand-50)) 0%, rgb(var(--stone-50)) 55%)",
      }}
    >
      <div className="grid max-w-[62ch] justify-items-center gap-3 text-center">
        <Eyebrow>Prototype sign-in</Eyebrow>
        <h1 className="font-display text-headline-lg text-stone-900">
          How would you like to continue?
        </h1>
        <p className="text-base leading-relaxed text-stone-700">
          Pick the view you want to preview. No password is needed while the real sign-in is
          being built.
        </p>
      </div>

      <div className="w-full max-w-[920px]">
        <Suspense fallback={null}>
          <RoleEntryCards />
        </Suspense>
      </div>

      <div className="w-full max-w-sm">
        <Disclosure trigger={<span>Use email and password instead</span>}>
          <div className="pt-2">
            <LoginForm />
          </div>
        </Disclosure>
        <p className="mt-3 text-center text-sm text-stone-600">
          Just exploring?{" "}
          <Link href="/coping" className="font-medium text-brand-600 hover:text-brand-700">
            Try the coping games without an account
          </Link>
        </p>
        <p className="mt-2 text-center text-sm text-stone-600">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-brand-600 hover:text-brand-700">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
