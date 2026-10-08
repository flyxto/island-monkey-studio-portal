import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format ISO datetime string or Date object in studio timezone (Asia/Colombo).
 * Example: 'Oct 24, 2026 - 10:00 AM'
 */
export function formatStudioDateTime(
  dateInput: string | Date | null | undefined,
  options?: Intl.DateTimeFormatOptions
): string {
  if (!dateInput) return ''
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput
  if (isNaN(date.getTime())) return ''

  const defaultOptions: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Colombo",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    ...options,
  }

  return new Intl.DateTimeFormat("en-US", defaultOptions)
    .format(date)
    .replace(",", "")
    .replace(" at", " -")
}

export const formatDateTime = formatStudioDateTime
