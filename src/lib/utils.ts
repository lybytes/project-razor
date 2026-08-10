import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const DISPLAY_NAME_MAX = 30;

export function sanitizeDisplayName(name: string): string {
  return name.replace(/\s+/g, " ").trim();
}

export function validateDisplayName(name: string): string | null {
  const sanitized = sanitizeDisplayName(name);

  if (sanitized.length < 2) {
    return "Name must be at least 2 characters.";
  }
  if (sanitized.length > DISPLAY_NAME_MAX) {
    return `Name must be ${DISPLAY_NAME_MAX} characters or fewer.`;
  }

  // Allow letters, numbers, spaces, hyphens, underscores, and apostrophes.
  // This prevents SQL injection payloads, HTML/JS injection, and control characters.
  if (!/^[A-Za-z0-9'’_\- ]+$/.test(sanitized)) {
    return "Name can only contain letters, numbers, spaces, hyphens, underscores, and apostrophes.";
  }

  return null;
}
