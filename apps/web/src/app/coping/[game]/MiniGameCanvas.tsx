"use client";

import type { GameProps, GameSlug } from "./gameData";
import { BodyScanGame } from "./games/BodyScanGame";
import { DefusionGame } from "./games/DefusionGame";
import { DistractionGame } from "./games/DistractionGame";
import { MindManagementGame } from "./games/MindManagementGame";

interface MiniGameCanvasProps extends GameProps {
  readonly slug: GameSlug;
}

// Dispatches to the game for a slug. Every game shares the GameProps contract
// (report a score when finished) so the shell never needs to know the rules.
export function MiniGameCanvas({ slug, onFinish }: MiniGameCanvasProps) {
  switch (slug) {
    case "defusion":
      return <DefusionGame onFinish={onFinish} />;
    case "distraction":
      return <DistractionGame onFinish={onFinish} />;
    case "mind-management":
      return <MindManagementGame onFinish={onFinish} />;
    case "body-scan":
      return <BodyScanGame onFinish={onFinish} />;
  }
}
