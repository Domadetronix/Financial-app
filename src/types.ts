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
