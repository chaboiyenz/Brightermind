import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 p-6">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-lg font-medium text-stone-900">Log in</h1>
        <LoginForm />
      </div>
    </main>
  );
}
