import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names, resolving Tailwind conflicts (e.g. "p-2 p-4" -> "p-4")
 * and handling conditional classes. Use this instead of string concatenation
 * or template literals for every component in this library.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
