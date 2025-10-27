export interface Expense {
    id: string;
    title: string;
    category: string;
    amount: number;
    date: string; // ISO string
    type: "recurring" | "once";
    fromRecurringId?: string;
}

export interface RecurringExpense {
    id: string;
    title: string;
    category: string;
    amount: number;
    day: number; // день месяца
}

export interface Meta {
    lastApplied: string | null; // YYYY-MM
}
