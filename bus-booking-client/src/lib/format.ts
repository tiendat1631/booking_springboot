import { format, parse, isValid } from "date-fns";
import { vi } from "date-fns/locale";

// ============================================
// DATE FORMATTING
// ============================================

/**
 * Format date to Vietnamese locale
 */
export function formatDate(
  date: Date | string | number | undefined,
  pattern: string = "dd MMMM, yyyy"
): string {
  if (!date) return "";
  try {
    const d = date instanceof Date ? date : new Date(date);
    return isValid(d) ? format(d, pattern, { locale: vi }) : "";
  } catch {
    return "";
  }
}

/**
 * Format time to HH:mm
 */
export function formatTime(date: Date | string | undefined): string {
  if (!date) return "";
  try {
    const d = date instanceof Date ? date : new Date(date);
    return isValid(d) ? format(d, "HH:mm") : "";
  } catch {
    return "";
  }
}

/**
 * Format date and time together
 */
export function formatDateTime(date: Date | string | undefined): { date: string; time: string } {
  return {
    date: formatDate(date),
    time: formatTime(date),
  };
}

/**
 * Format to ISO date string (yyyy-MM-dd) for Java @DateTimeFormat
 */
export function formatToISODate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

// ============================================
// DATE PARSING
// ============================================

/**
 * Parse ISO date string (yyyy-MM-dd) or timestamp to Date
 */
export function parseISODate(value: string | number | undefined): Date | undefined {
  if (!value) return undefined;

  // ISO date string (yyyy-MM-dd)
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const date = parse(value, "yyyy-MM-dd", new Date());
    return isValid(date) ? date : undefined;
  }

  // Numeric timestamp
  const timestamp = typeof value === "string" ? Number(value) : value;
  const date = new Date(timestamp);
  return isValid(date) ? date : undefined;
}

/**
 * Parse ISO string to date and time components (for form inputs)
 */
export function parseDateTime(isoString: string): { date: Date | undefined; time: string } {
  if (!isoString) return { date: undefined, time: "00:00" };
  try {
    const d = new Date(isoString);
    if (!isValid(d)) return { date: undefined, time: "00:00" };
    return { date: d, time: format(d, "HH:mm") };
  } catch {
    return { date: undefined, time: "00:00" };
  }
}

/**
 * Combine date and time into ISO string (for form submission)
 */
export function combineDateTimeToISO(date: Date | undefined, time: string): string {
  if (!date) return "";
  const [hours, minutes] = time.split(":").map(Number);
  const combined = new Date(date);
  combined.setHours(hours || 0, minutes || 0, 0, 0);
  return combined.toISOString();
}

// ============================================
// NUMBER & CURRENCY FORMATTING
// ============================================

/**
 * Format currency in VND
 */
export function formatCurrency(amount: number | undefined, currency = "VND"): string {
  if (amount == null) return "";
  try {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return "";
  }
}

/** Alias for formatCurrency */
export const formatPrice = formatCurrency;

// ============================================
// DURATION
// ============================================

/**
 * Format duration from minutes to human readable (e.g., "2h 30m")
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}
