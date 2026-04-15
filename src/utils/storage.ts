import { v4 as uuid } from 'uuid';

import { Expense, IncomeEntry, MonthExpense } from '../types';

const APP_DATA_KEY = 'appData';

interface AppData {
    incomeEntriesByMonth: Record<string, IncomeEntry[]>;
    expensesByMonth: Record<string, MonthExpense[]>;
    monthlyExpenses: Expense[];
    monthlyIncomes: IncomeEntry[];
}

const loadAppData = (): AppData => {
    const raw = localStorage.getItem(APP_DATA_KEY);
    if (!raw) {
        return { incomeEntriesByMonth: {}, expensesByMonth: {}, monthlyExpenses: [], monthlyIncomes: [] };
    }
    const data = JSON.parse(raw);

    // Миграция: старый формат incomeByMonth -> incomeEntriesByMonth
    if (data.incomeByMonth && !data.incomeEntriesByMonth) {
        data.incomeEntriesByMonth = {};
        Object.entries(data.incomeByMonth as Record<string, number>).forEach(([month, amount]) => {
            if (amount > 0) {
                data.incomeEntriesByMonth[month] = [{ id: uuid(), name: 'Доход', amount }];
            }
        });
        delete data.incomeByMonth;
    }

    if (!data.incomeEntriesByMonth) data.incomeEntriesByMonth = {};
    if (!data.monthlyIncomes) data.monthlyIncomes = [];
    if (!data.monthlyExpenses) data.monthlyExpenses = [];
    if (!data.expensesByMonth) data.expensesByMonth = {};

    return data as AppData;
};

const saveAppData = (data: AppData) => {
    localStorage.setItem(APP_DATA_KEY, JSON.stringify(data));
};

// ================== Доходы за месяц ==================
export const loadIncomeEntries = (): Record<string, IncomeEntry[]> => {
    return loadAppData().incomeEntriesByMonth;
};

export const saveIncomeEntries = (incomeEntriesByMonth: Record<string, IncomeEntry[]>) => {
    const data = loadAppData();
    data.incomeEntriesByMonth = incomeEntriesByMonth;
    saveAppData(data);
};

// ================== Шаблоны доходов ==================
export const loadMonthlyIncomes = (): IncomeEntry[] => {
    return loadAppData().monthlyIncomes;
};

export const saveMonthlyIncomes = (incomes: IncomeEntry[]) => {
    const data = loadAppData();
    data.monthlyIncomes = incomes;
    saveAppData(data);
};

// ================== Траты ==================
export const loadExpenses = (): Record<string, MonthExpense[]> => {
    return loadAppData().expensesByMonth;
};

export const saveExpenses = (expensesByMonth: Record<string, MonthExpense[]>) => {
    const data = loadAppData();
    data.expensesByMonth = expensesByMonth;
    saveAppData(data);
};

// ================== Шаблоны трат ==================
export const loadMonthlyExpenses = (): Expense[] => {
    return loadAppData().monthlyExpenses;
};

export const saveMonthlyExpenses = (expenses: Expense[]) => {
    const data = loadAppData();
    data.monthlyExpenses = expenses;
    saveAppData(data);
};
