// Parser for Barclays current-account PDF statements.
// Works from positioned text items (pdf.js getTextContent), so it runs in the browser
// and the PDF itself never has to leave the device.

export interface TextItem {
  str: string;
  x: number; // left edge
  y: number; // baseline, grows upwards
  width: number;
}

export interface ParsedTransaction {
  date: string; // YYYY-MM-DD (posting date)
  description: string; // first line, e.g. "Card Purchase Tesco Stores 3107"
  details: string; // remaining lines (refs, FX info, "On 27 May")
  amount: number; // negative = money out, positive = money in
  balance: number | null; // printed running balance, when Barclays shows one
}

export interface ParsedStatement {
  bank: 'barclays';
  accountNumber: string | null;
  sortCode: string | null;
  periodStart: string | null;
  periodEnd: string | null;
  startBalance: number | null;
  endBalance: number | null;
  totalIn: number | null;
  totalOut: number | null;
  transactions: ParsedTransaction[];
  warnings: string[];
}

const MONTHS: Record<string, number> = {
  Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
};

const AMOUNT_RE = /^£?\d{1,3}(,\d{3})*\.\d{2}$/;
const DATE_RE = /^(\d{2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)$/;

const toNumber = (s: string) => Number(s.replace(/[£,\s]/g, ''));
const round2 = (n: number) => Math.round(n * 100) / 100;
const pad = (n: number) => String(n).padStart(2, '0');

function findItem(items: TextItem[], re: RegExp) {
  return items.find((i) => re.test(i.str.trim()));
}

// "At a glance" values sit to the right of their label on the same line.
function glanceValue(items: TextItem[], label: string): number | null {
  const lbl = items.find((i) => i.str.trim() === label);
  if (!lbl) return null;
  const val = items.find(
    (i) => i.x > lbl.x + lbl.width && Math.abs(i.y - lbl.y) < 2 && AMOUNT_RE.test(i.str.trim()),
  );
  return val ? toNumber(val.str) : null;
}

export function parseBarclaysStatement(pages: TextItem[][]): ParsedStatement {
  const warnings: string[] = [];
  const first = pages[0] ?? [];

  const stmtDate = findItem(first, /^Statement date \d{2} \w{3} \d{4}$/)?.str.match(/(\d{2}) (\w{3}) (\d{4})/);
  const stmtYear = stmtDate ? Number(stmtDate[3]) : new Date().getFullYear();
  const stmtMonth = stmtDate ? MONTHS[stmtDate[2]] : 12;

  // Dates in the table have no year; anything after the statement month belongs to the previous year.
  const isoDate = (day: string, mon: string) => {
    const m = MONTHS[mon];
    const y = m > stmtMonth ? stmtYear - 1 : stmtYear;
    return `${y}-${pad(m)}-${day}`;
  };

  const accountNumber = findItem(first, /^Account no\. \d+/)?.str.match(/\d{8}/)?.[0] ?? null;
  const sortCode = findItem(first, /^Sort Code \d{2}-\d{2}-\d{2}/)?.str.match(/\d{2}-\d{2}-\d{2}/)?.[0] ?? null;

  let periodStart: string | null = null;
  let periodEnd: string | null = null;
  const period = findItem(first, /^\d{1,2} \w{3} - \d{1,2} \w{3} \d{4}$/)?.str.match(
    /^(\d{1,2}) (\w{3}) - (\d{1,2}) (\w{3}) \d{4}$/,
  );
  if (period) {
    periodStart = isoDate(pad(Number(period[1])), period[2]);
    periodEnd = isoDate(pad(Number(period[3])), period[4]);
  }

  const startBalanceGlance = glanceValue(first, 'Start balance');
  const totalIn = glanceValue(first, 'Money in');
  const totalOut = glanceValue(first, 'Money out');
  const endBalanceGlance = glanceValue(first, 'End balance');

  const transactions: ParsedTransaction[] = [];
  let startBalance: number | null = null;
  let endBalance: number | null = null;
  let currentDate: string | null = null;
  let done = false;

  for (const page of pages) {
    if (done) break;
    const hDesc = page.find((i) => i.str.trim() === 'Description');
    if (!hDesc) continue; // not a transactions page
    // Page 1 also has "Money in"/"Money out" in the "At a glance" box, so only
    // accept headings on the same line as "Description".
    const heading = (label: string) => page.find((i) => i.str.trim() === label && Math.abs(i.y - hDesc.y) < 3);
    const hOut = heading('Money out');
    const hIn = heading('Money in');
    const hBal = heading('Balance');
    if (!hOut || !hIn || !hBal) continue;

    // Amounts are right-aligned under their headers.
    const cols = {
      out: hOut.x + hOut.width,
      in: hIn.x + hIn.width,
      bal: hBal.x + hBal.width,
    };
    const colOf = (i: TextItem): 'out' | 'in' | 'bal' => {
      const right = i.x + i.width;
      const d = (c: number) => Math.abs(right - c);
      return d(cols.out) <= d(cols.in) && d(cols.out) <= d(cols.bal) ? 'out' : d(cols.in) <= d(cols.bal) ? 'in' : 'bal';
    };

    const headerY = hDesc.y;
    const tableRight = cols.bal + 20;
    const footer = page.find((i) => i.str.trim() === 'Continued');
    const bottomY = footer ? footer.y : 0;

    const tableItems = page.filter(
      (i) => i.str.trim() && i.y < headerY - 2 && i.y > bottomY + 2 && i.x < tableRight,
    );

    // Group into visual rows (top to bottom).
    tableItems.sort((a, b) => b.y - a.y || a.x - b.x);
    const rows: TextItem[][] = [];
    for (const it of tableItems) {
      const row = rows[rows.length - 1];
      if (row && Math.abs(row[0].y - it.y) < 2.5) row.push(it);
      else rows.push([it]);
    }

    let current: ParsedTransaction | null = null;
    for (const row of rows) {
      const dateItem = row.find((i) => i.x < hDesc.x - 5 && DATE_RE.test(i.str.trim()));
      const amounts = row.filter((i) => AMOUNT_RE.test(i.str.trim()) && i.x > hDesc.x + 100);
      const text = row
        .filter((i) => i !== dateItem && !amounts.includes(i))
        .map((i) => i.str.trim())
        .join(' ')
        .trim();

      if (dateItem) {
        const [, d, m] = dateItem.str.trim().match(DATE_RE)!;
        currentDate = isoDate(d, m);
      }

      if (text === 'Start balance') {
        const bal = amounts.find((a) => colOf(a) === 'bal');
        if (bal) startBalance = toNumber(bal.str);
        current = null;
        continue;
      }
      if (text === 'End balance') {
        const bal = amounts.find((a) => colOf(a) === 'bal');
        if (bal) endBalance = toNumber(bal.str);
        done = true;
        break;
      }

      const out = amounts.find((a) => colOf(a) === 'out');
      const inn = amounts.find((a) => colOf(a) === 'in');
      const bal = amounts.find((a) => colOf(a) === 'bal');

      if (out || inn) {
        if (!currentDate) {
          warnings.push(`Transaction "${text}" has no date; skipped.`);
          continue;
        }
        current = {
          date: currentDate,
          description: text,
          details: '',
          amount: out ? -toNumber(out.str) : toNumber(inn!.str),
          balance: bal ? toNumber(bal.str) : null,
        };
        transactions.push(current);
      } else if (current && text) {
        current.details = current.details ? `${current.details} ${text}` : text;
        if (bal && current.balance === null) current.balance = toNumber(bal.str);
      }
    }
  }

  // Reconcile against Barclays' own figures.
  startBalance ??= startBalanceGlance;
  endBalance ??= endBalanceGlance;
  const sumIn = round2(transactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0));
  const sumOut = round2(transactions.filter((t) => t.amount < 0).reduce((s, t) => s - t.amount, 0));
  if (totalIn !== null && sumIn !== totalIn) warnings.push(`Money in adds up to £${sumIn}, statement says £${totalIn}.`);
  if (totalOut !== null && sumOut !== totalOut) warnings.push(`Money out adds up to £${sumOut}, statement says £${totalOut}.`);

  if (startBalance !== null) {
    let running = startBalance;
    for (const t of transactions) {
      running = round2(running + t.amount);
      if (t.balance !== null && t.balance !== running) {
        warnings.push(`Balance mismatch on ${t.date} (${t.description}): expected £${running}, statement shows £${t.balance}.`);
        running = t.balance;
      }
    }
    if (endBalance !== null && running !== endBalance) warnings.push(`End balance works out at £${running}, statement says £${endBalance}.`);
  }

  if (transactions.length === 0) warnings.push('No transactions found — is this a Barclays current account statement?');

  return {
    bank: 'barclays',
    accountNumber,
    sortCode,
    periodStart,
    periodEnd,
    startBalance,
    endBalance,
    totalIn,
    totalOut,
    transactions,
    warnings,
  };
}
