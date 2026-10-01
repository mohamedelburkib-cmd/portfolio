// Usage: npx tsx scripts/parse-statement.ts <statement.pdf> [--json]
import fs from 'node:fs';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { extractPages } from '../src/lib/parser/pdf-text';
import { parseBarclaysStatement } from '../src/lib/parser/barclays';

const file = process.argv[2];
const doc = await getDocument({ data: new Uint8Array(fs.readFileSync(file)), verbosity: 0 }).promise;
const result = parseBarclaysStatement(await extractPages(doc));

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(result, null, 2));
} else {
  console.log(`${result.periodStart} → ${result.periodEnd}: ${result.transactions.length} transactions`);
  console.log(`  in £${result.totalIn}  out £${result.totalOut}  start £${result.startBalance}  end £${result.endBalance}`);
  console.log(result.warnings.length ? result.warnings.map((w) => `  ⚠ ${w}`).join('\n') : '  ✓ reconciles with statement totals and running balances');
}
