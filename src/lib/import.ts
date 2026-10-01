import * as pdfjs from 'pdfjs-dist';
// Running the PDF reader on the main thread keeps the whole app in one file that
// works when opened straight from disk (no separate worker file to load).
import * as pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs';
import { parseBarclaysStatement, type ParsedStatement } from './parser/barclays';
import { extractPages } from './parser/pdf-text';
import { merchantName } from './merchant';
import { applyRules } from './rules';
import type { Rule } from './categorise';
import type { StatementMeta, Transaction } from './types';

(globalThis as unknown as { pdfjsWorker: unknown }).pdfjsWorker = pdfWorker;

export interface ImportResult {
  fileName: string;
  statement: StatementMeta | null;
  transactions: Transaction[];
  warnings: string[];
  error?: string;
}

async function readPdf(file: File): Promise<ParsedStatement> {
  const doc = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()), verbosity: 0 }).promise;
  try {
    return parseBarclaysStatement(await extractPages(doc));
  } finally {
    await doc.destroy();
  }
}

// Same transaction in two overlapping statements gets the same id, so it is only stored once.
function transactionIds(s: ParsedStatement): string[] {
  const seen = new Map<string, number>();
  return s.transactions.map((t) => {
    const base = `${t.date}|${t.amount.toFixed(2)}|${t.description}|${t.details}`;
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    return `${base}|${n}`;
  });
}

export async function importStatement(file: File, rules: Rule[]): Promise<ImportResult> {
  try {
    const s = await readPdf(file);
    if (!s.transactions.length) {
      return { fileName: file.name, statement: null, transactions: [], warnings: s.warnings, error: 'No transactions found. Is this a Barclays current account statement?' };
    }
    const statementId = `${s.accountNumber ?? 'acct'}:${s.periodStart}:${s.periodEnd}`;
    const ids = transactionIds(s);
    const transactions = s.transactions.map((t, i) =>
      applyRules(
        {
          id: ids[i],
          date: t.date,
          description: t.description,
          details: t.details,
          merchant: merchantName(t.description),
          amount: t.amount,
          balance: t.balance,
          category: 'Miscellaneous',
          needsReview: false,
          suggestions: [],
          manual: false,
          statementId,
        },
        rules,
      ),
    );
    return {
      fileName: file.name,
      statement: {
        id: statementId,
        fileName: file.name,
        periodStart: s.periodStart,
        periodEnd: s.periodEnd,
        accountNumber: s.accountNumber ? s.accountNumber.slice(-4) : null,
        count: transactions.length,
        importedAt: new Date().toISOString(),
      },
      transactions,
      warnings: s.warnings,
    };
  } catch (e) {
    return { fileName: file.name, statement: null, transactions: [], warnings: [], error: `Couldn't read this PDF (${(e as Error).message}).` };
  }
}
