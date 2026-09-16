import { Dass21Questionnaire } from "./Dass21Questionnaire";

export default function Dass21Page() {
  return (
    <main className="mx-auto max-w-lg p-6">
      <h1 className="mb-2 text-lg font-medium text-stone-900">DASS-21 assessment</h1>
      <p className="mb-4 text-sm text-stone-600">Depression, Anxiety and Stress Scale. Answer based on the past week.</p>
      <Dass21Questionnaire />
    </main>
  );
}
