"use client";

import { useState } from "react";
import { SCENTS } from "./aromatherapyData";
import { BreathingTimer } from "./BreathingTimer";
import { ScentPicker } from "./ScentPicker";

// Client component orchestrating selection state (ScentPicker) and the
// breathing timer, per docs/frontend-migration-plan.md module 9's component
// breakdown (AromatherapyPage -> ScentPicker -> BreathingTimer).
export function AromatherapyContent() {
  const [selectedScent, setSelectedScent] = useState(SCENTS[0]);

  return (
    <div className="flex flex-col gap-8">
      <ScentPicker scents={SCENTS} selected={selectedScent} onSelect={setSelectedScent} />
      <BreathingTimer scent={selectedScent} />
    </div>
  );
}
