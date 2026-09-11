export {};

interface CalRide {
  id: string;
  kind: 'ride';
  name: string;
  href: string;
  days: string[];
  time?: string;
  seasonStart?: string;
  seasonEnd?: string;
}

interface CalEvent {
  id: string;
  kind: 'event';
  name: string;
  href: string;
  dateISO: string;
  time?: string;
}

type CalItem = CalRide | CalEvent;

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const MONTH_INDEX: Record<string, number> = Object.fromEntries(MONTH_NAMES.map((m, i) => [m, i]));

// Distinct per-ride colors so overlapping recurring rides stay visually
// separable on a busy day — hashed from the ride id, so a given ride keeps
// the same color across months without needing to hand-assign one.
const RIDE_COLORS = [
  { bg: '#e3f4fb', fg: '#0e5a78' }, // blue
  { bg: '#dff5f0', fg: '#0f766e' }, // teal
  { bg: '#f1e8fb', fg: '#6b21a8' }, // purple
  { bg: '#e6f6e6', fg: '#1e7d32' }, // green
  { bg: '#fdecd2', fg: '#b45309' }, // orange
  { bg: '#fde3ef', fg: '#9d174d' }, // magenta
  { bg: '#e5e7fb', fg: '#3730a3' }, // indigo
  { bg: '#f0e6da', fg: '#7c4a1e' }, // brown
  { bg: '#dff7fa', fg: '#0c6478' }, // cyan
  { bg: '#f2f2d0', fg: '#6b6b0f' }, // olive
];

function colorForRide(id: string): { bg: string; fg: string } {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return RIDE_COLORS[hash % RIDE_COLORS.length];
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

function toISODate(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function inSeason(ride: CalRide, monthIndex: number): boolean {
  if (!ride.seasonStart || !ride.seasonEnd) return true;
  const start = MONTH_INDEX[ride.seasonStart];
  const end = MONTH_INDEX[ride.seasonEnd];
  if (start == null || end == null) return true;
  if (start <= end) return monthIndex >= start && monthIndex <= end;
  return monthIndex >= start || monthIndex <= end;
}

function init() {
  const root = document.querySelector<HTMLElement>('[data-calendar]');
  const dataEl = document.getElementById('calendar-data');
  const gridEl = root?.querySelector<HTMLElement>('[data-cal-grid]');
  const labelEl = root?.querySelector<HTMLElement>('[data-cal-label]');
  const prevBtn = root?.querySelector<HTMLButtonElement>('[data-cal-prev]');
  const nextBtn = root?.querySelector<HTMLButtonElement>('[data-cal-next]');
  const todayBtn = root?.querySelector<HTMLButtonElement>('[data-cal-today]');
  if (!root || !dataEl || !gridEl || !labelEl) return;

  const items: CalItem[] = JSON.parse(dataEl.textContent ?? '[]');
  const rides = items.filter((i): i is CalRide => i.kind === 'ride');
  const events = items.filter((i): i is CalEvent => i.kind === 'event');

  const today = new Date();
  const todayISO = toISODate(today);
  let viewYear = today.getFullYear();
  let viewMonth = today.getMonth();

  function render() {
    if (!gridEl || !labelEl) return;
    labelEl.textContent = `${MONTH_NAMES[viewMonth]} ${viewYear}`;

    const firstOfMonth = new Date(viewYear, viewMonth, 1);
    const startOffset = firstOfMonth.getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;
    const gridStart = new Date(viewYear, viewMonth, 1 - startOffset);

    let html = '';
    for (let i = 0; i < totalCells; i += 1) {
      const cellDate = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i);
      const iso = toISODate(cellDate);
      const weekday = DAY_NAMES[cellDate.getDay()];
      const isOutside = cellDate.getMonth() !== viewMonth;
      const isToday = iso === todayISO;

      const dayEvents = events.filter((e) => e.dateISO === iso);
      const dayRides = rides.filter((r) => r.days.includes(weekday) && inSeason(r, cellDate.getMonth()));

      const entryHtml = [
        ...dayEvents.map((e) => {
          const label = `⭐ ${e.time ? `${escapeHtml(e.time)} ` : ''}${escapeHtml(e.name)}`;
          const title = `${e.name}${e.time ? ` · ${e.time}` : ''} (one-time event)`;
          return `<a class="cal-entry cal-entry--event" href="${e.href}" title="${escapeHtml(title)}">${label}</a>`;
        }),
        ...dayRides.map((r) => {
          const color = colorForRide(r.id);
          const label = `${r.time ? `${escapeHtml(r.time)} ` : ''}${escapeHtml(r.name)}`;
          const title = `${r.name}${r.time ? ` · ${r.time}` : ''} (recurring ride)`;
          return `<a class="cal-entry cal-entry--ride" style="background:${color.bg};color:${color.fg}" href="${r.href}" title="${escapeHtml(title)}">${label}</a>`;
        }),
      ].join('');

      html += `
        <div class="cal-cell${isOutside ? ' is-outside' : ''}${isToday ? ' is-today' : ''}">
          <time class="cal-cell__date" datetime="${iso}">${cellDate.getDate()}</time>
          <div class="cal-cell__entries">${entryHtml}</div>
        </div>
      `;
    }
    gridEl.innerHTML = html;
  }

  prevBtn?.addEventListener('click', () => {
    viewMonth -= 1;
    if (viewMonth < 0) {
      viewMonth = 11;
      viewYear -= 1;
    }
    render();
  });

  nextBtn?.addEventListener('click', () => {
    viewMonth += 1;
    if (viewMonth > 11) {
      viewMonth = 0;
      viewYear += 1;
    }
    render();
  });

  todayBtn?.addEventListener('click', () => {
    viewYear = today.getFullYear();
    viewMonth = today.getMonth();
    render();
  });

  root.querySelectorAll<HTMLInputElement>('[data-cal-toggle]').forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      root.classList.toggle(`hide-${checkbox.dataset.calToggle}`, !checkbox.checked);
    });
  });

  render();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
