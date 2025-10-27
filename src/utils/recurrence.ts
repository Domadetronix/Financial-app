import type { Expense, RecurringExpense, Meta } from "../types";

interface ApplyRecurringParams {
  expenses: Expense[];
  setExpenses: (e: Expense[]) => void;
  recurrings: RecurringExpense[];
  meta: Meta;
  setMeta: (m: Meta) => void;
}

export function applyMonthlyRecurrings({
  expenses,
  setExpenses,
  recurrings,
  meta,
  setMeta,
}: ApplyRecurringParams) {
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;

  if (meta.lastApplied === monthKey) return;

  const newOnes: Expense[] = recurrings.map((r) => ({
    id: crypto.randomUUID(),
    title: r.title,
    category: r.category,
    amount: r.amount,
    date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(r.day).padStart(2, "0")}`,
    type: "once",
    fromRecurringId: r.id,
  }));

  setExpenses([...expenses, ...newOnes]);
  setMeta({ ...meta, lastApplied: monthKey });
}
