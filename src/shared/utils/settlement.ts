import { GroupEventExpense } from '@/shared/types';

export interface Transfer {
  fromId: string;
  toId: string;
  amount: number;
}

/**
 * Вычисляет минимальный набор переводов для погашения оставшихся долгов.
 *
 * Участник, отметивший «я перевёл» (transferredByIds) на конкретной трате,
 * не учитывается в расчёте по этой трате.
 *
 * Оплативший необязательно входит в participantIds:
 * если не входит — все участники должны ему свою долю.
 */
export function computeSettlement(expenses: GroupEventExpense[]): Transfer[] {
  const balances: Record<string, number> = {};

  for (const expense of expenses) {
    if (expense.participantIds.length === 0) continue;

    const share = expense.amount / expense.participantIds.length;
    const transferred = expense.transferredByIds ?? [];

    for (const participantId of expense.participantIds) {
      if (participantId === expense.paidById) continue;
      if (transferred.includes(participantId)) continue;

      balances[participantId] = (balances[participantId] ?? 0) - share;
      balances[expense.paidById] = (balances[expense.paidById] ?? 0) + share;
    }
  }

  // Жадное упрощение: минимальное количество переводов
  const creditors = Object.entries(balances)
    .filter(([, b]) => b > 0.005)
    .map(([id, balance]) => ({ id, balance }));

  const debtors = Object.entries(balances)
    .filter(([, b]) => b < -0.005)
    .map(([id, balance]) => ({ id, balance: -balance }));

  const transfers: Transfer[] = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const amount = Math.min(debtors[i].balance, creditors[j].balance);
    transfers.push({
      fromId: debtors[i].id,
      toId: creditors[j].id,
      amount: Math.round(amount * 100) / 100,
    });
    debtors[i].balance -= amount;
    creditors[j].balance -= amount;
    if (debtors[i].balance < 0.005) i++;
    if (creditors[j].balance < 0.005) j++;
  }

  return transfers;
}
