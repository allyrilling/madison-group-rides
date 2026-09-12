import type { CollectionEntry } from 'astro:content';

export const TERRAIN_LABELS: Record<string, string> = {
  road: 'Road',
  gravel: 'Gravel',
  mountain: 'Mountain / Singletrack',
  trail: 'Trail / Path',
  mixed: 'Mixed',
};

export const TERRAIN_ICONS: Record<string, 'road' | 'gravel' | 'mountain' | 'trail' | 'bike'> = {
  road: 'road',
  gravel: 'gravel',
  mountain: 'mountain',
  trail: 'trail',
  mixed: 'bike',
};

export const PACE_LABELS: Record<string, string> = {
  casual: 'Casual',
  moderate: 'Moderate',
  brisk: 'Brisk',
  fast: 'Fast',
  varies: 'Varies',
};

export const DROP_LABELS: Record<string, string> = {
  'no-drop': 'No-drop',
  drop: 'Drop',
  varies: 'Varies',
};

export const ORGANIZER_TYPE_LABELS: Record<string, string> = {
  shop: 'Bike Shop',
  club: 'Cycling Club',
  team: 'Racing Team',
  nonprofit: 'Nonprofit / Advocacy',
  'informal-group': 'Informal Group',
};

export const DAY_ABBREVIATIONS: Record<string, string> = {
  Sunday: 'Sun',
  Monday: 'Mon',
  Tuesday: 'Tue',
  Wednesday: 'Wed',
  Thursday: 'Thu',
  Friday: 'Fri',
  Saturday: 'Sat',
};

export function formatDistance(range?: { min?: number; max?: number }): string | null {
  if (!range || (range.min == null && range.max == null)) return null;
  if (range.min != null && range.max != null && range.min !== range.max) {
    return `${range.min}–${range.max} mi`;
  }
  const value = range.min ?? range.max;
  return `${value} mi`;
}

export function formatPace(range?: { min?: number; max?: number }): string | null {
  if (!range || (range.min == null && range.max == null)) return null;
  if (range.min != null && range.max != null && range.min !== range.max) {
    return `${range.min}–${range.max} mph`;
  }
  const value = range.min ?? range.max;
  return `${value}+ mph`;
}

export function formatDays(days?: string[]): string | null {
  if (!days || days.length === 0) return null;
  return days.map((d) => DAY_ABBREVIATIONS[d] ?? d).join(' & ');
}

export function formatRideSchedule(ride: CollectionEntry<'rides'>['data']): string {
  const parts: string[] = [];
  const days = formatDays(ride.daysOfWeek);
  if (days) parts.push(days);
  if (ride.startTime) parts.push(ride.startTime);
  let schedule = parts.join(', ');
  if (!schedule) {
    schedule = ride.recurrence === 'varies' ? 'Schedule varies' : 'See organizer for schedule';
  }
  if (ride.seasonStart && ride.seasonEnd) {
    schedule += ` · ${ride.seasonStart}–${ride.seasonEnd}`;
  }
  return schedule;
}

export function formatEventDate(event: CollectionEntry<'events'>['data']): string {
  if (event.date) {
    return event.date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }
  return event.dateLabel ?? 'Date TBD';
}

export function isUpcoming(event: CollectionEntry<'events'>['data']): boolean {
  if (!event.date) return true;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return event.date >= today;
}
