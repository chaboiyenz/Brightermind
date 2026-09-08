import { type ReactNode } from "react";
import { Button } from "./Button";

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  icon?: ReactNode;
}

/**
 * Used for both genuinely-empty lists and failed-fetch states. Per the app's
 * writing guidance: explain what happened and how to fix it, in the interface's
 * voice — never a blank space, never vague ("Something went wrong").
 */
export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-stone-300 px-6 py-10 text-center">
      {icon && <div className="mb-1 text-stone-600">{icon}</div>}
      <p className="text-sm font-medium text-stone-800">{title}</p>
      {description && <p className="max-w-sm text-sm text-stone-600">{description}</p>}
      {action && (
        <Button variant="outline" size="sm" className="mt-2" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
