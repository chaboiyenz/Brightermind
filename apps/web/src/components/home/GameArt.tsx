import type { GameSlug } from "@/app/coping/[game]/gameData";

// Decorative, theme-token-driven art for each mini-game card. Hidden from
// assistive tech by the caller.
export function GameArt({ slug }: { slug: GameSlug }) {
  switch (slug) {
    case "defusion":
      return <DefusionTiles />;
    case "distraction":
      return <Orbit />;
    case "mind-management":
      return <Waves />;
    case "body-scan":
      return <ScanBars />;
  }
}

const TILE_COUNT = 9;
const LIT_TILE = 4;

function DefusionTiles() {
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {Array.from({ length: TILE_COUNT }, (_, index) => (
        <span
          key={index}
          className={
            index === LIT_TILE
              ? "h-[26px] w-[26px] rounded-[6px] bg-brand-500 motion-safe:animate-pulse-soft"
              : "h-[26px] w-[26px] rounded-[6px] bg-stone-200"
          }
        />
      ))}
    </div>
  );
}

function Orbit() {
  return (
    <span className="relative block h-[70px] w-[70px] rounded-full border-2 border-dashed border-stone-300">
      <span className="absolute -top-2 left-1/2 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-clay-400" />
    </span>
  );
}

function Waves() {
  return (
    <svg viewBox="0 0 120 56" className="h-14 w-[120px] fill-none stroke-brand-300" strokeWidth="2.5" strokeLinecap="round" focusable="false">
      <path d="M4 28c12-14 24-14 36 0s24 14 36 0 24-14 40 0" />
      <path d="M4 40c12-14 24-14 36 0s24 14 36 0 24-14 40 0" opacity=".5" />
    </svg>
  );
}

const SCAN_BAR_COUNT = 5;
const SCAN_ACTIVE_BAR = 2;

function ScanBars() {
  return (
    <div className="grid w-[90px] gap-[5px]">
      {Array.from({ length: SCAN_BAR_COUNT }, (_, index) => (
        <span
          key={index}
          className={
            index === SCAN_ACTIVE_BAR ? "h-[7px] rounded bg-brand-300" : "h-[7px] rounded bg-stone-200"
          }
        />
      ))}
    </div>
  );
}
