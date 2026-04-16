import { v4 as uuid } from 'uuid';

import { Expense, IncomeEntry, MonthExpense } from '@/shared/types';

const APP_DATA_KEY = 'appData';

interface StoredAppData {
  incomeEntriesByMonth: Record<string, IncomeEntry[]>;
  expensesByMonth: Record<string, MonthExpense[]>;
  monthlyExpenses: Expense[];
  monthlyIncomes: IncomeEntry[];
}

const loadAppData = (): StoredAppData => {
  const raw = localStorage.getItem(APP_DATA_KEY);
  if (!raw) {
    return { incomeEntriesByMonth: {}, expensesByMonth: {}, monthlyExpenses: [], monthlyIncomes: [] };
  }
  const data = JSON.parse(raw);

  // Миграция старого формата
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

  return data as StoredAppData;
};

const saveAppData = (data: StoredAppData) => {
  localStorage.setItem(APP_DATA_KEY, JSON.stringify(data));
};

export const loadIncomeEntries = (): Record<string, IncomeEntry[]> => loadAppData().incomeEntriesByMonth;

export const saveIncomeEntries = (incomeEntriesByMonth: Record<string, IncomeEntry[]>) => {
  const data = loadAppData();
  data.incomeEntriesByMonth = incomeEntriesByMonth;
  saveAppData(data);
};

export const loadMonthlyIncomes = (): IncomeEntry[] => loadAppData().monthlyIncomes;

export const saveMonthlyIncomes = (incomes: IncomeEntry[]) => {
  const data = loadAppData();
  data.monthlyIncomes = incomes;
  saveAppData(data);
};

export const loadExpenses = (): Record<string, MonthExpense[]> => loadAppData().expensesByMonth;

export const saveExpenses = (expensesByMonth: Record<string, MonthExpense[]>) => {
  const data = loadAppData();
  data.expensesByMonth = expensesByMonth;
  saveAppData(data);
};

export const loadMonthlyExpenses = (): Expense[] => loadAppData().monthlyExpenses;

export const saveMonthlyExpenses = (expenses: Expense[]) => {
  const data = loadAppData();
  data.monthlyExpenses = expenses;
  saveAppData(data);
};
