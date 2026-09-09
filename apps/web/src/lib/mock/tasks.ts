import type { Task } from "@/lib/api";

// Prototype pivot (.references/roadmap/prototype-roadmap.MD), decision (b)
// retrofit — static data, no call to GET /v2/tasks/. Shape is exactly Task
// from lib/api/tasks.ts. Titles/notes are invented placeholder content for
// design review only (ground rule 3). Mix of completed/incomplete across all
// three priority levels, so toggling has something to demonstrate either way.

const MOCK_TASKS: readonly Task[] = [
  {
    id: 1,
    title: "Finish anxiety journal reflection",
    notes: "For this week's check-in",
    deadline: "2026-09-12",
    priority: "high",
    category: "personal",
    is_completed: false,
    score: 0,
  },
  {
    id: 2,
    title: "Submit lab report",
    notes: "Due before 5pm",
    deadline: "2026-09-10",
    priority: "high",
    category: "work",
    is_completed: true,
    score: 3,
  },
  {
    id: 3,
    title: "Buy groceries",
    priority: "low",
    category: "shopping",
    is_completed: false,
    score: 1,
  },
  {
    id: 4,
    title: "Call mom",
    priority: "medium",
    category: "personal",
    is_completed: true,
    score: 2,
  },
  {
    id: 5,
    title: "Read one chapter for lit class",
    priority: "medium",
    category: "work",
    is_completed: false,
    score: 1,
  },
];

/**
 * Single swap point for the real fetch later (ground rule 5) — replace the
 * body with GET /v2/tasks/. Returns a fresh copy each call so the toggle
 * interaction's local-only mutation (see TaskList) never corrupts this
 * module-level fixture across renders.
 */
export function getMockTasks(): Task[] {
  return MOCK_TASKS.map((task) => ({ ...task }));
}
