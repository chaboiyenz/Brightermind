import { MovementLibraryContent } from "../MovementLibraryContent";

export default function YogaPage() {
  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="mb-4 text-lg font-medium text-stone-900">Yoga</h1>
      <MovementLibraryContent kind="yoga" />
    </main>
  );
}
