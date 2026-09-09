const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

/**
 * Coarse, friendly relative time ("2h ago", "3d ago") for post and comment
 * timestamps. Deliberately low-resolution so the label reads calmly and so
 * server and client renders almost never disagree; callers still mark the
 * element with suppressHydrationWarning for the rare boundary case.
 */
export function formatRelativeTime(iso: string, now: Date = new Date()): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";

  const seconds = Math.max(0, Math.round((now.getTime() - then) / 1000));
  if (seconds < MINUTE) return "just now";
  if (seconds < HOUR) return `${Math.floor(seconds / MINUTE)}m ago`;
  if (seconds < DAY) return `${Math.floor(seconds / HOUR)}h ago`;
  if (seconds < WEEK) return `${Math.floor(seconds / DAY)}d ago`;
  return `${Math.floor(seconds / WEEK)}w ago`;
}
