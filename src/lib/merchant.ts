// Turns a raw Barclays description into a stable merchant name, e.g.
// "Card Purchase Tesco Stores 3107 On 27" -> "Tesco Stores 3107".
const PREFIXES = [
  'card purchase',
  'card payment to',
  'bill payment to',
  'bill payment from',
  'direct debit to',
  'received from',
  'cash machine withdrawal at',
];

export function merchantName(description: string): string {
  let s = description.trim();
  const lower = s.toLowerCase();
  for (const p of PREFIXES) {
    if (lower.startsWith(p)) {
      s = s.slice(p.length).trim();
      break;
    }
  }
  // Drop the trailing transaction date Barclays appends: "On", "On 27", "On 27 Aug".
  s = s.replace(/\s+On(\s+\d{1,2}(\s+[A-Z][a-z]{2})?)?$/, '').trim();
  return s || description.trim();
}

export function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
