"use client";

import { useState } from "react";
import { useToast } from "@/components/ui";
import { routinesForKind, type MovementKind, type Routine } from "./movementData";
import { RoutineCard } from "./RoutineCard";
import { RoutineTimerModal } from "./RoutineTimerModal";

interface MovementLibraryContentProps {
  kind: MovementKind;
}

// Shared between /coping/exercise and /coping/yoga — nearly identical per
// docs/frontend-migration-plan.md module 7's note, worth one parametrized
// component rather than two parallel implementations.
export function MovementLibraryContent({ kind }: MovementLibraryContentProps) {
  const routines = routinesForKind(kind);
  const [activeRoutine, setActiveRoutine] = useState<Routine | null>(null);
  const { showToast } = useToast();

  function handleComplete(routine: Routine) {
    // Substitutes the migration plan's separate CompletionToast component
    // with the existing shared Toast system (components/ui) — reuse over a
    // bespoke second toast implementation, per ground rule 4.
    showToast({
      title: "Nice work!",
      description: `You completed ${routine.name}.`,
      tone: "success",
    });
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {routines.map((routine) => (
          <RoutineCard key={routine.id} routine={routine} onStart={() => setActiveRoutine(routine)} />
        ))}
      </div>

      <RoutineTimerModal
        routine={activeRoutine}
        onOpenChange={(open) => !open && setActiveRoutine(null)}
        onComplete={handleComplete}
      />
    </>
  );
}
