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
