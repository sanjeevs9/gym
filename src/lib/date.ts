import { addDays } from "date-fns";
import { fromZonedTime, formatInTimeZone } from "date-fns-tz";

// This app has one user, in India — always compute "today", day boundaries,
// and displayed dates/times in IST, regardless of the server runtime's local
// timezone (Vercel functions run in UTC) or the viewer's device timezone.
// Without this, "today" flips over up to 5.5 hours late relative to India
// during the UTC-lag window (00:00–05:29 IST).
export const APP_TIMEZONE = "Asia/Kolkata";

const DAY_KEY_FORMAT = "yyyy-MM-dd";
const DAY_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function formatInAppTz(date: Date, formatStr: string): string {
  return formatInTimeZone(date, APP_TIMEZONE, formatStr);
}

// The IST calendar day (yyyy-MM-dd) that a given instant falls on.
export function dayKey(date: Date): string {
  return formatInAppTz(date, DAY_KEY_FORMAT);
}

export function todayKey(): string {
  return dayKey(new Date());
}

export function isValidDayKey(key: string | undefined): key is string {
  if (!key || !DAY_KEY_PATTERN.test(key)) return false;
  const instant = fromZonedTime(`${key} 00:00:00.000`, APP_TIMEZONE);
  return !Number.isNaN(instant.getTime()) && dayKey(instant) === key;
}

// The absolute (UTC) instant for the start/end of the given IST calendar day.
export function startOfDayKey(key: string): Date {
  return fromZonedTime(`${key} 00:00:00.000`, APP_TIMEZONE);
}

export function endOfDayKey(key: string): Date {
  return fromZonedTime(`${key} 23:59:59.999`, APP_TIMEZONE);
}

// Back-compat: given any instant, find the IST day it falls on and return
// that day's boundaries — so passing the result of parseDayKey still works.
export function dayRange(date: Date = new Date()) {
  const key = dayKey(date);
  return { gte: startOfDayKey(key), lte: endOfDayKey(key) };
}

export function dayRangeForKey(key: string) {
  return { gte: startOfDayKey(key), lte: endOfDayKey(key) };
}

// Returns the instant for IST midnight of that day — a stable representative
// Date for a day key, safe to pass into dayRange/relativeDayLabel/etc.
export function parseDayKey(key: string): Date {
  return startOfDayKey(key);
}

export function shiftDayKey(key: string, days: number): string {
  return dayKey(addDays(startOfDayKey(key), days));
}

// Combines a yyyy-MM-dd day key with the current IST wall-clock time — used
// so backdated entries still sort sensibly within their day.
export function combineDayKeyWithNow(key: string): Date {
  const clockTime = formatInAppTz(new Date(), "HH:mm:ss.SSS");
  return fromZonedTime(`${key} ${clockTime}`, APP_TIMEZONE);
}

export function relativeDayLabel(date: Date): string {
  const key = dayKey(date);
  const today = todayKey();
  if (key === today) return "Today";
  if (key === shiftDayKey(today, -1)) return "Yesterday";
  return formatInAppTz(date, "EEEE, MMMM d");
}

export function lastNDaysRange(days: number) {
  const today = todayKey();
  const start = shiftDayKey(today, -(days - 1));
  return { gte: startOfDayKey(start), lte: endOfDayKey(today) };
}

export function labelForDay(date: Date): string {
  return formatInAppTz(date, "MMM d");
}
