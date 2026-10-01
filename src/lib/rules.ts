import { categorise, type Rule } from './categorise';
import { escapeRegex } from './merchant';
import type { AppData, Transaction } from './types';

// Your names as they appear on statements mean money moving between your own accounts.
function ownNameRule(names: string[]): Rule[] {
  const cleaned = names.map((n) => n.trim()).filter(Boolean);
  if (!cleaned.length) return [];
  const alt = cleaned.map((n) => escapeRegex(n.toLowerCase()).replace(/[\s-]+/g, '[\\s-]*')).join('|');
  return [{ pattern: `\\b(${alt})\\b`, category: 'Transfers' }];
}

export function activeRules(data: Pick<AppData, 'rules' | 'ownNames'>): Rule[] {
  return [...data.rules, ...ownNameRule(data.ownNames)];
}

export function applyRules(t: Transaction, rules: Rule[]): Transaction {
  if (t.manual) return t;
  const c = categorise(t, rules);
  return { ...t, category: c.category, needsReview: c.needsReview, suggestions: c.suggestions };
}

export function recategoriseAll(data: AppData): AppData {
  const rules = activeRules(data);
  return { ...data, transactions: data.transactions.map((t) => applyRules(t, rules)) };
}
