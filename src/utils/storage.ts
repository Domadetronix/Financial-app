import { Expense } from "../types";

export const saveExpenses = (expenses: Expense[]) => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
};

export const loadExpenses = (): Expense[] => {
    const data = localStorage.getItem("expenses");
    return data ? JSON.parse(data) : [];
};

export const saveIncome = (income: number) => {
    localStorage.setItem("income", income.toString());
};

export const loadIncome = (): number => {
    const data = localStorage.getItem("income");
    return data ? Number(data) : 0;
};
