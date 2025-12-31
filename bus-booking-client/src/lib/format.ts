export function formatDate(
  date: Date | string | number | undefined,
  opts: Intl.DateTimeFormatOptions = {},
) {
  if (!date) return "";

  try {
    return new Intl.DateTimeFormat("vi-VN", {
      month: opts.month ?? "long",
      day: opts.day ?? "numeric",
      year: opts.year ?? "numeric",
      ...opts,
    }).format(new Date(date));
  } catch {
    return "";
  }
}

/**
 * Format a Date to ISO date string (yyyy-MM-dd) for Java @DateTimeFormat compatibility
 */
export function formatToISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Parse an ISO date string (yyyy-MM-dd) or timestamp to Date
 */
export function parseISODate(value: string | number | undefined): Date | undefined {
  if (!value) return undefined;
  
  // Try parsing as ISO date string first (yyyy-MM-dd)
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const date = new Date(value + "T00:00:00");
    return !Number.isNaN(date.getTime()) ? date : undefined;
  }
  
  // Fallback to numeric timestamp for backward compatibility
  const numericTimestamp = typeof value === "string" ? Number(value) : value;
  const date = new Date(numericTimestamp);
  return !Number.isNaN(date.getTime()) ? date : undefined;
}

export function formatCurrency(
  amount: number | undefined,
  currency: string = "VND",
) {
  if (amount === undefined || amount === null) return "";

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

export function formatNumber(
  value: number | undefined,
  opts: Intl.NumberFormatOptions = {},
) {
  if (value === undefined || value === null) return "";

  try {
    return new Intl.NumberFormat("vi-VN", opts).format(value);
  } catch {
    return "";
  }
}

/**
 * Format time to Vietnamese locale (HH:mm)
 */
export function formatTime(date: Date | string | undefined): string {
  if (!date) return "";

  try {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
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
 * Format duration from minutes to human readable string (e.g., "2h 30m")
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

/**
 * Alias for formatCurrency - formats price in VND
 */
export const formatPrice = formatCurrency;

/**
 * Combine date and time into ISO string for form value
 */
export function combineDateTimeToISO(date: Date | undefined, time: string): string {
    if (!date) return "";
    const [hours, minutes] = time.split(":").map(Number);
    const combined = new Date(date);
    combined.setHours(hours || 0, minutes || 0, 0, 0);
    return combined.toISOString();
}

/**
 * Parse date from form value (any value that can be converted to Date)
 */
export function parseDateFromValue(value: unknown): Date | undefined {
    if (!value || typeof value !== "string") return undefined;
    const date = new Date(value);
    return isNaN(date.getTime()) ? undefined : date;
}

/**
 * Parse time string (HH:mm) from form value
 */
export function parseTimeFromValue(value: unknown, defaultTime = "08:00"): string {
    if (!value || typeof value !== "string") return defaultTime;
    const date = new Date(value);
    if (isNaN(date.getTime())) return defaultTime;
    return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

/**
 * Generate time options for select (00:00 to 23:30 in intervals)
 */
export function generateTimeOptions(intervalMinutes = 30): string[] {
    const options: string[] = [];
    for (let h = 0; h < 24; h++) {
        for (let m = 0; m < 60; m += intervalMinutes) {
            options.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
        }
    }
    return options;
}
