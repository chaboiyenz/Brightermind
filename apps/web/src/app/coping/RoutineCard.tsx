import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import type { Routine } from "./movementData";

interface RoutineCardProps {
  routine: Routine;
  onStart: () => void;
}

export function RoutineCard({ routine, onStart }: RoutineCardProps) {
  const minutes = Math.round(routine.durationSeconds / 60);

  return (
    <Card>
      {/* No real image asset pipeline in this prototype — a soft placeholder
          block stands in for RoutineCard's imageUrl until real assets exist. */}
      <div className="mb-3 h-24 rounded-md bg-sage-100" aria-hidden />
      <CardHeader>
        <CardTitle>{routine.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p>{routine.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-stone-600">{minutes} min</span>
          <Button size="sm" onClick={onStart}>
            Start
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
