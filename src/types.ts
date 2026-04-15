export interface Expense {
    id: string;
    name: string;
    amount: number;
}

export interface MonthExpense extends Expense {
    closed: boolean;
}

export const isMonthExpense = (e: Expense): e is MonthExpense => 'closed' in e;

export interface AppData {
    incomeByMonth: Record<string, number>;
    expensesByMonth: Record<string, MonthExpense[]>;
    monthlyExpenses: Expense[];
}
