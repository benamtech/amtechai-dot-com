export const INDUSTRIES = [
  'Real Estate',
  'E-Commerce / Retail',
  'Service Business',
  'Political or Nonprofit Outreach',
] as const;

export const TOPICS = [
  'Online Advertising',
  'AI Phone Systems — Outbound, Sales, Secretary',
  'AI Employees',
  'Custom AI Tools',
  'Custom Web Development',
] as const;

export type Industry = typeof INDUSTRIES[number];
export type Topic = typeof TOPICS[number];

function formatSlot(hour: number, minute: number): string {
  const h12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const m = minute.toString().padStart(2, '0');
  return `${h12}:${m} ${ampm} PST`;
}

function shiftSlots(baselines: [number, number][], offsetMinutes: number): string[] {
  return baselines.map(([h, m]) => {
    let totalMinutes = h * 60 + m + offsetMinutes;
    const hour = Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;
    return formatSlot(hour, minute);
  });
}

const BASELINE_SLOTS: [number, number][] = [
  [9, 30],
  [11, 0],
  [12, 30],
  [13, 0],
  [15, 0],
];

export function getSlotsForDate(date: Date): string[] {
  const dow = date.getDay();
  if (dow === 4 || dow === 1) return shiftSlots(BASELINE_SLOTS, 0);
  if (dow === 5 || dow === 2) return shiftSlots(BASELINE_SLOTS, 30);
  if (dow === 6 || dow === 3) return shiftSlots(BASELINE_SLOTS, -30);
  return [];
}

export const TIME_SLOTS = shiftSlots(BASELINE_SLOTS, 0);

export function isWeekday(date: Date): boolean {
  const day = date.getDay();
  return day !== 0 && day !== 6;
}

export function formatDateForDisplay(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateForDB(date: Date): string {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}
