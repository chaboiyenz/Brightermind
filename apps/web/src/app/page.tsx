import { ApiStatus } from "@/components/ApiStatus";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-stone-50 text-stone-900">
      <p>BrighterMind v2 — web scaffold.</p>
      <ApiStatus />
    </main>
  );
}
