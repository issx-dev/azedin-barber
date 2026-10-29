/**
 * Open / closed status, computed in the shop's own time zone.
 *
 * Pure logic (no DOM): `getOpenStatus(hours, date)` takes the `hours` array
 * from src/data/content.js (slots like '10:00 – 14:00') and any Date, and
 * returns what to say right now in Berja. The machine's time zone is never
 * used: wall-clock time comes from Intl with timeZone 'Europe/Madrid', so DST
 * and visitors abroad are handled by the browser's tz database.
 *
 * Only the browser calls this. The page is static, so "now" must never be
 * computed at build time (see CLAUDE.md, Gotchas).
 */

export const TIME_ZONE = 'Europe/Madrid';
const CLOSING_SOON_MIN = 30;

const DAY_NAMES = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const WEEKDAY_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

let partsFormatter;

/** Weekday (0 = Monday) and minutes since midnight in Europe/Madrid. */
export function madridNow(date = new Date()) {
  partsFormatter ??= new Intl.DateTimeFormat('en-GB', {
    timeZone: TIME_ZONE,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });
  const p = Object.fromEntries(partsFormatter.formatToParts(date).map((x) => [x.type, x.value]));
  return { day: WEEKDAY_EN.indexOf(p.weekday), minutes: Number(p.hour) * 60 + Number(p.minute) };
}

const toMin = (h, m) => Number(h) * 60 + Number(m);
export const formatTime = (min) =>
  `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;

/**
 * Week as 7 lists of [open, close] in minutes, Monday first. Days are matched
 * by name so the order of `hours` in content.js does not matter.
 */
export function parseWeek(hours) {
  const week = DAY_NAMES.map(() => []);
  hours.forEach((h, i) => {
    const idx = DAY_NAMES.indexOf(h.day);
    const day = idx >= 0 ? idx : i;
    for (const slot of h.slots ?? []) {
      const m = /(\d{1,2}):(\d{2})\s*[–—-]\s*(\d{1,2}):(\d{2})/.exec(slot);
      if (m && week[day]) week[day].push([toMin(m[1], m[2]), toMin(m[3], m[4])]);
    }
  });
  week.forEach((slots) => slots.sort((a, b) => a[0] - b[0]));
  return week;
}

/**
 * @returns {{ open: boolean, closingSoon: boolean, label: string,
 *             today: number, dayName: string, todaySlots: string[],
 *             closesAt?: string, opensAt?: string, opensInDays?: number }}
 *   `today` is 0 = Monday; `dayName` matches the `day` field in content.js.
 */
export function getOpenStatus(hours, date = new Date()) {
  const week = parseWeek(hours);
  const { day, minutes } = madridNow(date);
  const base = { today: day, dayName: DAY_NAMES[day], todaySlots: week[day].map(([o, c]) => `${formatTime(o)} – ${formatTime(c)}`) };

  const current = week[day].find(([o, c]) => minutes >= o && minutes < c);
  if (current) {
    const closesAt = formatTime(current[1]);
    const closingSoon = current[1] - minutes <= CLOSING_SOON_MIN;
    return {
      ...base,
      open: true,
      closingSoon,
      closesAt,
      label: closingSoon ? `Abierto · cierra a las ${closesAt}` : `Abierto ahora · hasta las ${closesAt}`,
    };
  }

  const laterToday = week[day].find(([o]) => o > minutes);
  if (laterToday) {
    const opensAt = formatTime(laterToday[0]);
    return { ...base, open: false, closingSoon: false, opensAt, opensInDays: 0, label: `Cerrado · abre a las ${opensAt}` };
  }

  for (let offset = 1; offset <= 7; offset++) {
    const d = (day + offset) % 7;
    if (!week[d].length) continue;
    const opensAt = formatTime(week[d][0][0]);
    const when = offset === 1 ? 'mañana' : `el ${DAY_NAMES[d].toLowerCase()}`;
    return { ...base, open: false, closingSoon: false, opensAt, opensInDays: offset, label: `Cerrado · abre ${when} a las ${opensAt}` };
  }

  return { ...base, open: false, closingSoon: false, label: 'Cerrado' };
}

/**
 * Run `fn` now and at every minute boundary while the tab is visible; pause
 * when hidden and catch up immediately on return. Browser-only helper.
 */
export function everyMinute(fn) {
  let timer;
  const stop = () => clearTimeout(timer);
  const tick = () => {
    fn();
    stop();
    timer = setTimeout(tick, 60000 - (Date.now() % 60000) + 50);
  };
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : tick()));
  if (!document.hidden) tick();
}
