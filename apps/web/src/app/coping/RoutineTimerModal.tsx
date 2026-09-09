"use client";

import { useEffect, useState } from "react";
import { Button, Modal } from "@/components/ui";
import type { Routine } from "./movementData";

interface RoutineTimerModalProps {
  routine: Routine | null;
  onOpenChange: (open: boolean) => void;
  onComplete: (routine: Routine) => void;
}

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function RoutineTimerModal({ routine, onOpenChange, onComplete }: RoutineTimerModalProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(routine?.durationSeconds ?? 0);
  const [isRunning, setIsRunning] = useState(false);

  // Reset the countdown whenever a new routine is opened.
  useEffect(() => {
    setSecondsRemaining(routine?.durationSeconds ?? 0);
    setIsRunning(false);
  }, [routine]);

  // Purely client-side — no backend needed for this to actually work, per
  // the prototype pivot's note on this exact component.
  useEffect(() => {
    if (!isRunning || secondsRemaining <= 0) return;
    const interval = setInterval(() => {
      setSecondsRemaining((current) => {
        if (current <= 1) {
          setIsRunning(false);
          if (routine) onComplete(routine);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, secondsRemaining, routine, onComplete]);

  if (!routine) return null;

  return (
    <Modal open={routine !== null} onOpenChange={onOpenChange} title={routine.name}>
      <div className="flex flex-col items-center gap-6 py-4">
        <p className="text-4xl font-medium text-stone-900">{formatTime(secondsRemaining)}</p>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsRunning((running) => !running)}
            disabled={secondsRemaining === 0}
          >
            {isRunning ? "Pause" : "Start"}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setSecondsRemaining(routine.durationSeconds);
              setIsRunning(false);
            }}
          >
            Reset
          </Button>
        </div>
      </div>
    </Modal>
  );
}
