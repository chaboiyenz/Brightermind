import { Who5Questionnaire } from "./Who5Questionnaire";

export default function Who5Page() {
  return (
    <main className="mx-auto max-w-lg p-6">
      <h1 className="mb-2 text-lg font-medium text-stone-900">WHO-5 well-being check-in</h1>
      <p className="mb-4 text-sm text-stone-600">Five questions about how you have felt over the last two weeks.</p>
      <Who5Questionnaire />
    </main>
  );
}
