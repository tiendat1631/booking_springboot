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
