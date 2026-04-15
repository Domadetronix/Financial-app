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

export interface GroupMember {
    telegramId: string;
    name: string;
    photoUrl?: string;
}

export interface Group {
    id: string;
    name: string;
    ownerTelegramId: string;
    inviteCode: string;
    memberIds: string[];
    members: GroupMember[];
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
