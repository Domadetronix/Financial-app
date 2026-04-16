import { doc, getDoc, setDoc } from 'firebase/firestore';

import { AppData, Expense, IncomeEntry, MonthExpense } from '@/shared/types';
import {
  loadExpenses,
  loadIncomeEntries,
  loadMonthlyExpenses,
  loadMonthlyIncomes,
  saveExpenses as lsSaveExpenses,
  saveIncomeEntries as lsSaveIncomeEntries,
  saveMonthlyExpenses as lsSaveMonthlyExpenses,
  saveMonthlyIncomes as lsSaveMonthlyIncomes,
} from '@/shared/utils/storage';

import { firestoreDb, isFirestoreEnabled } from './firebase';

export const LOCAL_USER_ID = 'local';

const shouldUseFirestore = (userId: string) => isFirestoreEnabled && userId !== LOCAL_USER_ID;

const userRef = (userId: string) => {
  if (!firestoreDb) throw new Error('Firestore not initialized');
  return doc(firestoreDb, 'users', userId);
};

const emptyAppData = (): AppData => ({
  incomeEntriesByMonth: {},
  expensesByMonth: {},
  monthlyExpenses: [],
  monthlyIncomes: [],
});

export const loadAllData = async (userId: string): Promise<AppData> => {
  if (!shouldUseFirestore(userId)) {
    return {
      incomeEntriesByMonth: loadIncomeEntries(),
      expensesByMonth: loadExpenses(),
      monthlyExpenses: loadMonthlyExpenses(),
      monthlyIncomes: loadMonthlyIncomes(),
    };
  }

  const ref = userRef(userId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    const localData: AppData = {
      incomeEntriesByMonth: loadIncomeEntries(),
      expensesByMonth: loadExpenses(),
      monthlyExpenses: loadMonthlyExpenses(),
      monthlyIncomes: loadMonthlyIncomes(),
    };

    const hasData =
      Object.keys(localData.incomeEntriesByMonth).length > 0 ||
      Object.keys(localData.expensesByMonth).length > 0 ||
      localData.monthlyExpenses.length > 0 ||
      localData.monthlyIncomes.length > 0;

    if (hasData) {
      await setDoc(ref, localData);
    }

    return hasData ? localData : emptyAppData();
  }

  const data = snap.data() as Partial<AppData>;
  return {
    incomeEntriesByMonth: data.incomeEntriesByMonth ?? {},
    expensesByMonth: data.expensesByMonth ?? {},
    monthlyExpenses: data.monthlyExpenses ?? [],
    monthlyIncomes: data.monthlyIncomes ?? [],
  };
};

export const saveExpenses = (userId: string, expensesByMonth: Record<string, MonthExpense[]>): void => {
  if (!shouldUseFirestore(userId)) { lsSaveExpenses(expensesByMonth); return; }
  setDoc(userRef(userId), { expensesByMonth }, { merge: true });
};

export const saveIncomeEntries = (userId: string, incomeEntriesByMonth: Record<string, IncomeEntry[]>): void => {
  if (!shouldUseFirestore(userId)) { lsSaveIncomeEntries(incomeEntriesByMonth); return; }
  setDoc(userRef(userId), { incomeEntriesByMonth }, { merge: true });
};

export const saveMonthlyExpenses = (userId: string, monthlyExpenses: Expense[]): void => {
  if (!shouldUseFirestore(userId)) { lsSaveMonthlyExpenses(monthlyExpenses); return; }
  setDoc(userRef(userId), { monthlyExpenses }, { merge: true });
};

export const saveMonthlyIncomes = (userId: string, monthlyIncomes: IncomeEntry[]): void => {
  if (!shouldUseFirestore(userId)) { lsSaveMonthlyIncomes(monthlyIncomes); return; }
  setDoc(userRef(userId), { monthlyIncomes }, { merge: true });
};

export const saveUserSettings = (userId: string, settings: Record<string, unknown>): void => {
  if (!shouldUseFirestore(userId)) return;
  setDoc(userRef(userId), { settings }, { merge: true });
};

export const loadUserSettings = async (userId: string): Promise<Record<string, unknown>> => {
  if (!shouldUseFirestore(userId)) return {};
  const snap = await getDoc(userRef(userId));
  if (!snap.exists()) return {};
  return (snap.data()?.settings as Record<string, unknown>) ?? {};
};
