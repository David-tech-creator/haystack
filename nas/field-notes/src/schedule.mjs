// When to run, in Zurich time. Kept apart from main.mjs so it can be tested without starting the scheduler.
export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const WINDOW_END = '12:00';

/** "Tue,Thu" (any case, any separator, full names fine) -> Set of 'Tue', 'Thu'. Throws on nonsense. */
export function parseDays(spec = 'Tue,Thu') {
  const days = new Set();
  for (const raw of String(spec).split(/[\s,;]+/).filter(Boolean)) {
    const d = WEEKDAYS.find((w) => w.toLowerCase() === raw.slice(0, 3).toLowerCase());
    if (!d) throw new Error(`FIELD_NOTES_DAYS: unknown day "${raw}"`);
    days.add(d);
  }
  if (!days.size) throw new Error('FIELD_NOTES_DAYS: no days given');
  return days;
}

/** "8:30" or "08:30" -> "08:30". Throws on nonsense, so a typo stops the container instead of never running. */
export function parseRunAt(s = '08:30') {
  const m = /^(\d{1,2}):(\d{2})$/.exec(String(s).trim());
  if (!m || Number(m[1]) > 23 || Number(m[2]) > 59) throw new Error(`FIELD_NOTES_RUN_AT: bad time "${s}"`);
  return `${m[1].padStart(2, '0')}:${m[2]}`;
}

/** Day, time and weekday in Zurich. */
export function zurich(at = new Date()) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Zurich', weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(at).map((x) => [x.type, x.value]));
  return { day: `${p.year}-${p.month}-${p.day}`, time: `${p.hour === '24' ? '00' : p.hour}:${p.minute}`, weekday: p.weekday };
}

/** Whether the scheduler should start a run now. One attempt per publishing day, inside the window. */
export function due({ day, time, weekday }, { days, runAt, lastDay }) {
  return days.has(weekday) && time >= runAt && time < WINDOW_END && lastDay !== day;
}
