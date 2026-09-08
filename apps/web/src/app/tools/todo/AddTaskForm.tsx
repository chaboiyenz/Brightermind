"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { Button, FormField, Input } from "@/components/ui";
import { createTask, type Priority, type TaskCategory } from "@/lib/api";

const selectClass =
  "w-full rounded-sm border border-stone-300 bg-stone-25 px-3 py-2 text-sm text-stone-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500";

export function AddTaskForm() {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [category, setCategory] = useState<TaskCategory>("personal");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => createTask({ title, priority, category }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setTitle("");
      setPriority("medium");
      setCategory("personal");
    },
  });

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (title.trim() === "") return;
    mutation.mutate();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-2">
      <div className="min-w-[200px] flex-1">
        <FormField label="New task" htmlFor="task-title">
          <Input
            id="task-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs doing?"
          />
        </FormField>
      </div>

      <FormField label="Priority" htmlFor="task-priority">
        <select
          id="task-priority"
          className={selectClass}
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </FormField>

      <FormField label="Category" htmlFor="task-category">
        <select
          id="task-category"
          className={selectClass}
          value={category}
          onChange={(e) => setCategory(e.target.value as TaskCategory)}
        >
          <option value="work">Work</option>
          <option value="personal">Personal</option>
          <option value="shopping">Shopping</option>
        </select>
      </FormField>

      <Button type="submit" isLoading={mutation.isPending} disabled={mutation.isPending}>
        Add
      </Button>
    </form>
  );
}
