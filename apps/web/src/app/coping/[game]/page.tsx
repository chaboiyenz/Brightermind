import { notFound } from "next/navigation";
import { MiniGameCanvas } from "./MiniGameCanvas";
import { GAME_TITLES, isGameSlug } from "./gameData";

interface MiniGamePageProps {
  params: Promise<{ game: string }>;
}

// MiniGamePage (docs/frontend-migration-plan.md module 8) — one consistent
// shell across all four games, rather than four visually unrelated pages.
export default async function MiniGamePage({ params }: MiniGamePageProps) {
  const { game } = await params;

  if (!isGameSlug(game)) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-lg p-6">
      <h1 className="mb-6 text-lg font-medium text-stone-900">{GAME_TITLES[game]}</h1>
      <MiniGameCanvas slug={game} />
    </main>
  );
}
