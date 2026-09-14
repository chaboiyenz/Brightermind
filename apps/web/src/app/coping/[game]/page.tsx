import { notFound } from "next/navigation";
import { MiniGameShell } from "./MiniGameShell";
import { GAME_META, GAME_SLUGS, isGameSlug } from "./gameData";

interface MiniGamePageProps {
  params: Promise<{ game: string }>;
}

// Pre-render the four known games; anything else is a real 404.
export function generateStaticParams() {
  return GAME_SLUGS.map((game) => ({ game }));
}

export async function generateMetadata({ params }: MiniGamePageProps) {
  const { game } = await params;
  if (!isGameSlug(game)) return {};
  return { title: `${GAME_META[game].title} · BrighterMind` };
}

// MiniGamePage (docs/frontend-migration-plan.md module 8) — one consistent
// shell across all four games, rather than four visually unrelated pages.
export default async function MiniGamePage({ params }: MiniGamePageProps) {
  const { game } = await params;

  if (!isGameSlug(game)) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
      <MiniGameShell slug={game} />
    </main>
  );
}
