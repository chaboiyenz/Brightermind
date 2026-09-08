"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { EmptyState, Skeleton } from "@/components/ui";
import { deleteTask, fetchTasks, toggleTask, type Task } from "@/lib/api";
import { TaskItem } from "./TaskItem";

interface TaskListProps {
  initialTasks?: Task[];
}

export function TaskList({ initialTasks }: TaskListProps) {
  const queryClient = useQueryClient();
  const [rowErrors, setRowErrors] = useState<Record<number, string>>({});

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => fetchTasks(),
    initialData: initialTasks,
  });

  const toggleMutation = useMutation({
    mutationFn: (id: number) => toggleTask(id),
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
