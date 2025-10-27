export interface Expense {
    id: string;
    name: string;
    amount: number;
    type: "monthly" | "one-time";
}


export interface EditData {
    id: string;
    name: string;
    amount: number;
    type: "monthly" | "one-time";
}

export interface AppData {
    incomeByMonth: Record<string, number>; // например: { "2025-10": 120000 }
    expensesByMonth: Record<string, Expense[]>; // траты по месяцам
    monthlyExpenses: Expense[]; // база постоянных трат
}
