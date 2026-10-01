import type { Category, Rule } from './categorise';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  details: string;
  merchant: string;
  amount: number; // negative = out
  balance: number | null;
  category: Category;
  needsReview: boolean;
  suggestions: Category[];
  manual: boolean; // category chosen by you — rules never overwrite it
  statementId: string;
}

export interface StatementMeta {
  id: string;
  fileName: string;
  periodStart: string | null;
  periodEnd: string | null;
  accountNumber: string | null; // last 4 digits only
  count: number;
  importedAt: string;
}

export interface UserRule extends Rule {
  id: string;
  label: string; // what the person typed / the merchant it came from
  createdAt: string;
}

export interface AppData {
  version: 1;
  transactions: Transaction[];
  statements: StatementMeta[];
  rules: UserRule[];
  ownNames: string[];
  budgets: Partial<Record<Category, number>>;
}

export const EMPTY_DATA: AppData = {
  version: 1,
  transactions: [],
  statements: [],
  rules: [],
  ownNames: [],
  budgets: {},
};
