export const MUSEUM_TIMEZONE = 'Australia/Adelaide';

export function money(value: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
  }).format(value / 100);
}

export function localDay(value: string | Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: MUSEUM_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(value));
}

export function date(value: string | null | undefined, withTime = false): string {
  if (!value) return '—';
  const parsed = new Date(value.length === 10 ? `${value}T12:00:00+09:30` : value);
  if (Number.isNaN(parsed.getTime())) return '—';
  return new Intl.DateTimeFormat('en-AU', {
    timeZone: MUSEUM_TIMEZONE,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit', hour12: false } : {}),
  }).format(parsed);
}

export function adelaideInput(value: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: MUSEUM_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date(value));
  const get = (key: string) => parts.find((p) => p.type === key)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}`;
}

export function adelaideTimestamp(value: string): string {
  const wall = Date.parse(`${value}Z`);
  let guess = wall;
  for (let i = 0; i < 3; i++) {
    const displayed = Date.parse(`${adelaideInput(new Date(guess).toISOString())}Z`);
    guess += wall - displayed;
  }
  if (adelaideInput(new Date(guess).toISOString()) !== value)
    throw new Error('This time does not exist in Adelaide. Choose another time.');
  return new Date(guess).toISOString();
}

export function membershipStatus(member: {
  payment: string;
  joinDate: string;
  expiryDate: string;
}): string {
  if (member.payment !== 'Paid' || member.joinDate > localDay()) return 'Pending';
  return member.expiryDate < localDay() ? 'Expired' : 'Active';
}

export function downloadCsv(name: string, headings: string[], rows: unknown[][]) {
  const cell = (value: unknown) => {
    let text = String(value ?? '');
    if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
    return `"${text.replaceAll('"', '""')}"`;
  };
  const blob = new Blob(
    ['\uFEFF', [headings, ...rows].map((row) => row.map(cell).join(',')).join('\r\n')],
    { type: 'text/csv;charset=utf-8' },
  );
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}
