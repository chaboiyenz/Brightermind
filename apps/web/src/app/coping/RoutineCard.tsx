import { type ComponentType } from "react";
import {
  Armchair,
  Clock,
  Coffee,
  MoonStar,
  PersonStanding,
  Play,
  Sun,
  Sunrise,
  Zap,
  type LucideProps,
} from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import type { Routine } from "./movementData";

interface RoutineCardProps {
  routine: Routine;
  onStart: () => void;
}

// Maps each routine to a representative icon so the placeholder visual reads
// as intentional rather than empty, without needing a real image pipeline
// yet (see movementData.ts's note on that).
const ROUTINE_ICONS: Record<string, ComponentType<LucideProps>> = {
  "morning-stretch": Sunrise,
  "desk-break": Coffee,
  "energy-boost": Zap,
  "sun-salutation": Sun,
  "evening-wind-down": MoonStar,
  "seated-calm": Armchair,
};

export function RoutineCard({ routine, onStart }: RoutineCardProps) {
  const minutes = Math.round(routine.durationSeconds / 60);
  const Icon = ROUTINE_ICONS[routine.id] ?? PersonStanding;

  return (
    <Card className="flex flex-col gap-4 transition-shadow hover:shadow-md">
      <div className="flex h-28 items-center justify-center rounded-md bg-brand-50" aria-hidden>
        <Icon className="h-9 w-9 text-brand-600" strokeWidth={1.5} />
      </div>

      <CardHeader className="mb-0">
        <CardTitle>{routine.name}</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        <p className="flex-1">{routine.description}</p>
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-xs text-stone-600">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            {minutes} min
          </span>
          <Button size="sm" onClick={onStart}>
            <Play className="h-3.5 w-3.5" aria-hidden />
            Start
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
