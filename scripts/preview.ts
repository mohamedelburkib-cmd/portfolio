// Usage: npx tsx scripts/preview.ts <statement.pdf>... — parse + categorise and print a summary.
import fs from 'node:fs';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { extractPages } from '../src/lib/parser/pdf-text';
import { parseBarclaysStatement } from '../src/lib/parser/barclays';
import { categorise, NON_SPENDING, type Rule } from '../src/lib/categorise';

// Optional, gitignored: personal rules such as your own name for account-to-account transfers.
const personalRules: Rule[] = fs.existsSync('personal-rules.local.json')
  ? JSON.parse(fs.readFileSync('personal-rules.local.json', 'utf8'))
  : [];

const rows = [];
for (const file of process.argv.slice(2)) {
  const doc = await getDocument({ data: new Uint8Array(fs.readFileSync(file)), verbosity: 0 }).promise;
  const s = parseBarclaysStatement(await extractPages(doc));
  for (const t of s.transactions) rows.push({ ...t, ...categorise(t, personalRules) });
}

const byCat = new Map<string, { n: number; total: number }>();
for (const r of rows) {
  const k = r.needsReview ? `? ${r.category} (confirm)` : r.category;
  const e = byCat.get(k) ?? { n: 0, total: 0 };
  e.n++; e.total += r.amount;
  byCat.set(k, e);
}
console.log(`${rows.length} transactions\n`);
for (const [k, v] of [...byCat].sort((a, b) => a[1].total - b[1].total))
  console.log(`${String(v.n).padStart(4)}  ${v.total.toFixed(2).padStart(10)}  ${k}${NON_SPENDING.includes(k as never) ? '  (not spending)' : ''}`);

console.log('\nTo confirm:');
for (const r of rows.filter((r) => r.needsReview)) console.log(`  ${r.date} ${r.amount.toFixed(2).padStart(9)}  ${r.description}  → ${r.category}? [${r.suggestions.join('/') || 'any'}]`);
