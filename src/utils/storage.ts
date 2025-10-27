import { Expense } from "../types";

const APP_DATA_KEY = "appData";

interface AppData {
    incomeByMonth: Record<string, number>;
    expensesByMonth: Record<string, Expense[]>;
    monthlyExpenses: Expense[];
}

// Получаем всё приложение из localStorage
const loadAppData = (): AppData => {
    const data = localStorage.getItem(APP_DATA_KEY);
    if (!data) {
        return { incomeByMonth: {}, expensesByMonth: {}, monthlyExpenses: [] };
    }
    return JSON.parse(data);
};

// Сохраняем всё приложение в localStorage
const saveAppData = (data: AppData) => {
    localStorage.setItem(APP_DATA_KEY, JSON.stringify(data));
};

// ================== Доход ==================
export const loadIncome = (month?: string): number => {
    const data = loadAppData();
    if (month) return data.incomeByMonth[month] || 0;
    return 0;
};

export const saveIncome = (month: string, income: number) => {
    const data = loadAppData();
    data.incomeByMonth[month] = income;
    saveAppData(data);
};

// ================== Траты ==================
export const loadExpenses = (): Record<string, Expense[]> => {
    const data = loadAppData();
    return data.expensesByMonth;
};

export const saveExpenses = (expensesByMonth: Record<string, Expense[]>) => {
    const data = loadAppData();
    data.expensesByMonth = expensesByMonth;
    saveAppData(data);
};

// ================== Ежемесячные траты ==================
export const loadMonthlyExpenses = (): Expense[] => {
    const data = loadAppData();
    return data.monthlyExpenses;
};

export const saveMonthlyExpenses = (expenses: Expense[]) => {
    const data = loadAppData();
    data.monthlyExpenses = expenses;
    saveAppData(data);
};
