"use client";

import { Badge, Button } from "@/components/ui";
import type { Task } from "@/lib/api";

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const PRIORITY_TONE = {
  low: "neutral",
  medium: "brand",
  high: "warning",
} as const;

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-stone-200 bg-stone-25 p-3">
      <input
        type="checkbox"
        checked={task.is_completed}
        onChange={() => onToggle(task.id)}
        className="h-4 w-4 rounded-sm border-stone-300 text-brand-600 focus:ring-brand-500"
        aria-label={`Mark "${task.title}" ${task.is_completed ? "incomplete" : "complete"}`}
      />
      <div className="flex-1">
        <p className={task.is_completed ? "text-stone-500 line-through" : "text-stone-900"}>
          {task.title}
        </p>
        {task.notes && <p className="text-xs text-stone-600">{task.notes}</p>}
      </div>
      <Badge tone={PRIORITY_TONE[task.priority]}>{task.priority}</Badge>
      <Badge tone="neutral">{task.category}</Badge>
      <Button variant="ghost" size="sm" onClick={() => onDelete(task.id)}>
        Delete
      </Button>
    </div>
  );
}
