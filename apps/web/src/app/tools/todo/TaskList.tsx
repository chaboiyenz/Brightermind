"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { EmptyState, Skeleton } from "@/components/ui";
import { deleteTask, fetchTasks, toggleTask, type Task } from "@/lib/api";
import { isMockMode } from "@/lib/mock/mockMode";
import { getMockTasks } from "@/lib/mock/tasks";
import { TaskItem } from "./TaskItem";

interface TaskListProps {
  initialTasks?: Task[];
}

export function TaskList({ initialTasks }: TaskListProps) {
  const queryClient = useQueryClient();
  const [rowErrors, setRowErrors] = useState<Record<number, string>>({});

  // Mock-mode retrofit: queryFn (not just SSR initialData) has to stay
  // mock-aware too, since react-query background-refetches on mount by
  // default — without this branch that refetch would hit the real API even
  // under NEXT_PUBLIC_MOCK_MODE=true.
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => (isMockMode() ? Promise.resolve(getMockTasks()) : fetchTasks()),
    initialData: initialTasks,
  });

  const toggleMutation = useMutation({
    // Toggling is genuinely interactive (requirement: confirm it still
    // works sensibly against fallback data), so mock mode computes the
    // flip locally — mirroring the real endpoint's response shape — instead
    // of calling PATCH /v2/tasks/:id/toggle/. Local state only, no
    // persistence, same as every other mocked interactive element here.
    mutationFn: (id: number): Promise<Task> => {
      if (isMockMode()) {
        const current = queryClient.getQueryData<Task[]>(["tasks"]);
        const task = current?.find((t) => t.id === id);
        if (!task) return Promise.reject(new Error("Task not found"));
        return Promise.resolve({
          ...task,
          is_completed: !task.is_completed,
          score: task.is_completed ? Math.max(task.score - 1, 0) : task.score + 1,
        });
      }
      return toggleTask(id);
    },
    onMutate: async (id: number) => {
      setRowErrors((current) => ({ ...current, [id]: "" }));
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previous = queryClient.getQueryData<Task[]>(["tasks"]);

      // Optimistic flip — approximate the score delta for immediate
      // feedback; the onSuccess response below is what actually applies
      // the authoritative delta, this is just UI snappiness in the meantime.
      queryClient.setQueryData<Task[]>(["tasks"], (current) =>
        current?.map((task) =>
          task.id === id
            ? {
                ...task,
                is_completed: !task.is_completed,
                score: task.is_completed ? Math.max(task.score - 1, 0) : task.score + 1,
              }
            : task
        )
      );

      return { previous };
    },
    onError: (error: unknown, id, context) => {
      // Revert the optimistic change — never leave the UI showing a state
      // the server rejected.
      if (context?.previous) {
        queryClient.setQueryData(["tasks"], context.previous);
      }
      setRowErrors((current) => ({
        ...current,
        [id]: error instanceof Error ? error.message : "Couldn't update this task.",
      }));
    },
    onSuccess: (updatedTask) => {
      queryClient.setQueryData<Task[]>(["tasks"], (current) =>
        current?.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
    },
  });

  // NOTE: unlike toggle above, delete (and AddTaskForm's create) still call
  // the real API even in mock mode — only the initial/populated view and
  // the toggle interaction were in scope for this retrofit. Flagging per
  // ground rule 3 rather than silently mocking further: without a backend
  // running, this will fail silently (no onError handler) instead of
  // deleting anything.
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteTask(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2" aria-label="Loading tasks">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-14 rounded-md" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        title="Couldn't load your tasks"
        description="Something went wrong."
        action={{ label: "Retry", onClick: () => refetch() }}
      />
    );
  }

  if (!data || data.length === 0) {
    return <EmptyState title="No tasks yet" description="Add one below to get started." />;
  }

  return (
    <div className="flex flex-col gap-2">
      {data.map((task) => (
        <div key={task.id}>
          <TaskItem
            task={task}
            onToggle={(id) => toggleMutation.mutate(id)}
            onDelete={(id) => deleteMutation.mutate(id)}
          />
          {rowErrors[task.id] && (
            <p className="mt-1 text-xs text-brick-600" role="alert">
              {rowErrors[task.id]}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
