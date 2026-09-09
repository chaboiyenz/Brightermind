import { cn } from "@/lib/cn";
import type { Scent } from "./aromatherapyData";

interface ScentPickerProps {
  scents: Scent[];
  selected: Scent;
  onSelect: (scent: Scent) => void;
}

export function ScentPicker({ scents, selected, onSelect }: ScentPickerProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {scents.map((scent) => (
        <button
          key={scent.id}
          type="button"
          onClick={() => onSelect(scent)}
          className={cn(
            "flex flex-col gap-2 rounded-lg border p-4 text-left transition-colors",
            selected.id === scent.id
              ? "border-brand-500 bg-brand-50"
              : "border-stone-200 bg-stone-25 hover:bg-stone-50"
          )}
        >
          {/* No real photo asset pipeline in this prototype — a warm
              placeholder block stands in for Scent's imageUrl. */}
          <div className="h-16 rounded-md bg-clay-100" aria-hidden />
          <p className="font-medium text-stone-900">{scent.name}</p>
          <p className="text-xs text-stone-600">{scent.description}</p>
        </button>
      ))}
    </div>
  );
}
