import { SignupForm } from "./SignupForm";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 p-6">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-lg font-medium text-stone-900">Sign up</h1>
        <SignupForm />
      </div>
    </main>
  );
}
