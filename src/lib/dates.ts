import type { PartialDate } from '../data/cv';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Formats `YYYY-MM` as "May 2022" and leaves `YYYY` as is. */
export function formatPartialDate(date: PartialDate): string {
  const [year, month] = date.split('-');
  return month ? `${MONTHS[Number(month) - 1]} ${year}` : year;
}

/**
 * Formats a date range as "May 2022–Aug 2026".
 * `end: null` renders "Present"; an omitted `end` renders the start date alone.
 */
export function formatDateRange(start: PartialDate, end?: PartialDate | null): string {
  if (end === undefined) return formatPartialDate(start);
  return `${formatPartialDate(start)}–${end === null ? 'Present' : formatPartialDate(end)}`;
}

/** Formats `YYYY-MM-DD` as "Nov 10, 2026". */
export function formatDay(date: string): string {
  const [year, month, day] = date.split('-');
  return `${MONTHS[Number(month) - 1]} ${Number(day)}, ${year}`;
}
