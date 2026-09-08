export { ApiError, apiFetch, getApiBaseUrl, TOKEN_COOKIE } from "./client";
export { fetchHealth, type HealthStatus } from "./health";
export {
  createMoodEntry,
  DuplicateMoodEntryError,
  fetchMoodEntries,
  type CreateMoodEntryInput,
  type MoodEntry,
  type MoodValue,
} from "./mood";
export {
  clearToken,
  fetchCurrentUser,
  login,
  registerPsychologist,
  registerStudent,
  type AuthUser,
  type LoginInput,
  type RegisterPsychologistInput,
  type RegisterStudentInput,
  type Role,
} from "./auth";
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
export { fetchContentBlock, type ContentBlock } from "./content";
