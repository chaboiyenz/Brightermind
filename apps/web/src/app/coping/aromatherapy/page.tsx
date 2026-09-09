import { AromatherapyContent } from "./AromatherapyContent";

export default function AromatherapyPage() {
  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-2 text-lg font-medium text-stone-900">Aromatherapy</h1>
      <p className="mb-6 text-sm text-stone-600">
        Pick a scent, then follow the breathing rhythm that goes with it.
      </p>
      <AromatherapyContent />
    </main>
  );
}
