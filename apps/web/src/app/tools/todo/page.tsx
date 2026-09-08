import { cookies } from "next/headers";
import { fetchTasks, TOKEN_COOKIE, type Task } from "@/lib/api";
import { AddTaskForm } from "./AddTaskForm";
import { TaskList } from "./TaskList";

export default async function TodoPage() {
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;

  // Phase 3's token cookie is same-origin (set by apps/web itself), so this
  // genuinely works now — see apps/web/src/app/mood/page.tsx for the fuller
  // explanation of what this replaced.
  let tasks: Task[] | undefined;
  try {
    tasks = await fetchTasks(token);
  } catch {
    tasks = undefined;
  }

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
