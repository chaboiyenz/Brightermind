import { apiFetch } from "./client";

// Exact shapes from docs/frontend-migration-plan.md module 6.
export type Priority = "low" | "medium" | "high";
export type TaskCategory = "work" | "personal" | "shopping";

export interface Task {
  id: number;
  title: string;
  notes?: string;
  deadline?: string;
  priority: Priority;
  category: TaskCategory;
  is_completed: boolean;
  score: number;
}

export interface CreateTaskInput {
  title: string;
  notes?: string;
  deadline?: string;
  priority?: Priority;
  category?: TaskCategory;
}

export async function fetchTasks(forwardCookie?: string): Promise<Task[]> {
  return apiFetch<Task[]>("/v2/tasks/", { forwardCookie });
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  return apiFetch<Task>("/v2/tasks/", { method: "POST", body: JSON.stringify(input) });
}

// The score +1/-1 delta is computed server-side (Task.toggle_completed) —
// this just applies whatever the response says, never computes it itself.
export async function toggleTask(id: number): Promise<Task> {
  return apiFetch<Task>(`/v2/tasks/${id}/toggle/`, { method: "PATCH" });
}

export async function deleteTask(id: number): Promise<void> {
  return apiFetch<void>(`/v2/tasks/${id}/`, { method: "DELETE" });
}
