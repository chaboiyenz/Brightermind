import { cookies } from "next/headers";
import { fetchTasks, TOKEN_COOKIE, type Task } from "@/lib/api";
import { isMockMode } from "@/lib/mock/mockMode";
import { getMockTasks } from "@/lib/mock/tasks";
import { AddTaskForm } from "./AddTaskForm";
import { TaskList } from "./TaskList";

// Mock-mode retrofit (decision (b), docs/prototype-roadmap.md) — matches
// home page.tsx's loadHeroBlock pattern: static fallback data when mock mode
// is on, real fetch otherwise, falling back to the same static data (rather
// than undefined) if that fetch errors — demo resilience if the API happens
// to be down, same as home's "on or on error" behavior.
async function loadTasks(): Promise<Task[]> {
  if (isMockMode()) return getMockTasks();

  // Phase 3's token cookie is same-origin (set by apps/web itself), so this
  // genuinely works now — see apps/web/src/app/mood/page.tsx for the fuller
  // explanation of what this replaced.
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;
  try {
    return await fetchTasks(token);
  } catch {
    return getMockTasks();
  }
}

export default async function TodoPage() {
  const tasks = await loadTasks();

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-4 text-lg font-medium text-stone-900">To-do list</h1>
      <div className="mb-6">
        <AddTaskForm />
      </div>
      <TaskList initialTasks={tasks} />
    </main>
  );
}
