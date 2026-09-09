import { MovementLibraryContent } from "../MovementLibraryContent";

export default function ExercisePage() {
  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="mb-4 text-lg font-medium text-stone-900">Exercise</h1>
      <MovementLibraryContent kind="exercise" />
    </main>
  );
}
