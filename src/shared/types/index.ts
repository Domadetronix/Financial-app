export interface Expense {
  id: string;
  name: string;
  amount: number;
}

export interface MonthExpense extends Expense {
  closed: boolean;
}

export const isMonthExpense = (e: Expense): e is MonthExpense => 'closed' in e;

export interface IncomeEntry {
  id: string;
  name: string;
  amount: number;
}

export interface AppData {
  incomeEntriesByMonth: Record<string, IncomeEntry[]>;
  expensesByMonth: Record<string, MonthExpense[]>;
  monthlyExpenses: Expense[];
  monthlyIncomes: IncomeEntry[];
}

export type GroupType = 'budget' | 'event';

export interface GroupMember {
  telegramId: string;
  name: string;
  photoUrl?: string;
}

/** Участник без Telegram-аккаунта, добавляется создателем группы */
export interface MockMember {
  id: string;
  name: string;
}

export interface Group {
  id: string;
  name: string;
  type: GroupType;
  ownerTelegramId: string;
  inviteCode: string;
  memberIds: string[];
  members: GroupMember[];
  mockMembers?: MockMember[];
  /** Кастомное имя участника в рамках группы (telegramId|mockId → имя) */
  memberDisplayNames?: Record<string, string>;
  createdAt: string;
}

export interface GroupIncomeEntry extends IncomeEntry {
  addedByTelegramId: string;
}

export interface GroupMonthExpense extends MonthExpense {
  addedByTelegramId: string;
}

export interface GroupData {
  incomeEntriesByMonth: Record<string, GroupIncomeEntry[]>;
  expensesByMonth: Record<string, GroupMonthExpense[]>;
  monthlyIncomes: IncomeEntry[];
  monthlyExpenses: Expense[];
}

// ── Event-группы ──────────────────────────────────────────────────────────────

export interface GroupEventExpense {
  id: string;
  name: string;
  amount: number;
  addedByTelegramId: string;
  paidById: string;
  participantIds: string[];
  /** Участники, уже переведшие свою долю оплатившему */
  transferredByIds?: string[];
  createdAt: string;
}

export interface EventGroupData {
  expenses: GroupEventExpense[];
}

// ── Настройки пользователя ────────────────────────────────────────────────────

export interface UserSettings {
  primaryColor?: string;
}
