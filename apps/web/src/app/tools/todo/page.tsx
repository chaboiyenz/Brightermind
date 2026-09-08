import { cookies } from "next/headers";
import { fetchTasks, type Task } from "@/lib/api";
import { AddTaskForm } from "./AddTaskForm";
import { TaskList } from "./TaskList";

export default async function TodoPage() {
  const cookieStore = await cookies();

  let tasks: Task[] | undefined;
  try {
    tasks = await fetchTasks(cookieStore.toString());
  } catch {
    // Same cross-origin cookie limitation documented in apps/web/src/app/mood/page.tsx —
    // TaskList's client-side query is the real data source.
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
