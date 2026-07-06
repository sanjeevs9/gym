import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  format,
  parse,
  isValid,
  isToday,
  isYesterday,
} from "date-fns";

const DAY_KEY_FORMAT = "yyyy-MM-dd";

export function dayRange(date: Date = new Date()) {
  return { gte: startOfDay(date), lte: endOfDay(date) };
}

export function todayKey() {
  return format(new Date(), DAY_KEY_FORMAT);
}

export function isValidDayKey(key: string | undefined): key is string {
  if (!key) return false;
  return isValid(parse(key, DAY_KEY_FORMAT, new Date()));
}

export function parseDayKey(key: string): Date {
  return parse(key, DAY_KEY_FORMAT, new Date());
}

export function shiftDayKey(key: string, days: number): string {
  return format(addDays(parseDayKey(key), days), DAY_KEY_FORMAT);
}

// Combines a yyyy-MM-dd day key with the current wall-clock time — used so
// backdated entries still sort sensibly within their day.
export function combineDayKeyWithNow(key: string): Date {
  const now = new Date();
  const day = parseDayKey(key);
  day.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
  return day;
}

export function relativeDayLabel(date: Date): string {
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "EEEE, MMMM d");
}

export function lastNDaysRange(days: number) {
  const end = endOfDay(new Date());
  const start = startOfDay(subDays(new Date(), days - 1));
  return { gte: start, lte: end };
}

export function dayKey(date: Date) {
  return format(date, "yyyy-MM-dd");
}

export function labelForDay(date: Date) {
  return format(date, "MMM d");
}
