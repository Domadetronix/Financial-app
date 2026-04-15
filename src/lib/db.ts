import { doc, getDoc, setDoc } from 'firebase/firestore';

import { firestoreDb, isFirestoreEnabled } from './firebase';

import { AppData, Expense, IncomeEntry, MonthExpense } from '../types';
import {
  loadExpenses,
  loadIncomeEntries,
  loadMonthlyExpenses,
  loadMonthlyIncomes,
  saveExpenses as lsSaveExpenses,
  saveIncomeEntries as lsSaveIncomeEntries,
  saveMonthlyExpenses as lsSaveMonthlyExpenses,
  saveMonthlyIncomes as lsSaveMonthlyIncomes
} from '../utils/storage';

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
  monthlyIncomes: []
});

// ── Загрузка всех данных пользователя ──────────────────────────────────────
// Вызывается один раз при монтировании страницы.
// Если Firestore включён и документ не существует — автомигрирует localStorage.

export const loadAllData = async (userId: string): Promise<AppData> => {
  if (!shouldUseFirestore(userId)) {
    return {
      incomeEntriesByMonth: loadIncomeEntries(),
      expensesByMonth: loadExpenses(),
      monthlyExpenses: loadMonthlyExpenses(),
      monthlyIncomes: loadMonthlyIncomes()
    };
  }

  const ref = userRef(userId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    const localData: AppData = {
      incomeEntriesByMonth: loadIncomeEntries(),
      expensesByMonth: loadExpenses(),
      monthlyExpenses: loadMonthlyExpenses(),
      monthlyIncomes: loadMonthlyIncomes()
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
    monthlyIncomes: data.monthlyIncomes ?? []
  };
};

// ── Сохранение отдельных полей (fire-and-forget на стороне UI) ─────────────

export const saveExpenses = (
  userId: string,
  expensesByMonth: Record<string, MonthExpense[]>
): void => {
  if (!shouldUseFirestore(userId)) {
    lsSaveExpenses(expensesByMonth);
    return;
  }
  setDoc(userRef(userId), { expensesByMonth }, { merge: true });
};

export const saveIncomeEntries = (
  userId: string,
  incomeEntriesByMonth: Record<string, IncomeEntry[]>
): void => {
  if (!shouldUseFirestore(userId)) {
    lsSaveIncomeEntries(incomeEntriesByMonth);
    return;
  }
  setDoc(userRef(userId), { incomeEntriesByMonth }, { merge: true });
};

export const saveMonthlyExpenses = (userId: string, monthlyExpenses: Expense[]): void => {
  if (!shouldUseFirestore(userId)) {
    lsSaveMonthlyExpenses(monthlyExpenses);
    return;
  }
  setDoc(userRef(userId), { monthlyExpenses }, { merge: true });
};

export const saveMonthlyIncomes = (userId: string, monthlyIncomes: IncomeEntry[]): void => {
  if (!shouldUseFirestore(userId)) {
    lsSaveMonthlyIncomes(monthlyIncomes);
    return;
  }
  setDoc(userRef(userId), { monthlyIncomes }, { merge: true });
};
