const gbp = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });
const gbp0 = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 });

export const money = (n: number) => gbp.format(n);
export const money0 = (n: number) => gbp0.format(Math.round(n));

export const monthKey = (iso: string) => iso.slice(0, 7);

export function monthLabel(key: string, style: 'long' | 'short' = 'long') {
  const [y, m] = key.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('en-GB', { month: style, year: style === 'long' ? 'numeric' : undefined });
}

export function dayLabel(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

export const pct = (n: number) => `${Math.round(n * 100)}%`;
