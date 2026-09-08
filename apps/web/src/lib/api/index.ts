export { ApiError, apiFetch, getApiBaseUrl } from "./client";
export { fetchHealth, type HealthStatus } from "./health";
export {
  createMoodEntry,
  DuplicateMoodEntryError,
  fetchMoodEntries,
  type CreateMoodEntryInput,
  type MoodEntry,
  type MoodValue,
} from "./mood";
export { devLogin, type DevLoginInput, type DevLoginResult } from "./auth";
export {
  createJournalEntry,
  deleteJournalEntry,
  fetchJournalEntries,
  updateJournalEntry,
  type JournalEntry,
  type JournalEntryInput,
} from "./journal";
export {
  createTask,
  deleteTask,
  fetchTasks,
  toggleTask,
  type CreateTaskInput,
  type Priority,
  type Task,
  type TaskCategory,
} from "./tasks";
