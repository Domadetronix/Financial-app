// src/App.tsx
import React, { useEffect } from "react";

import Main from "./components/main";
import { useLocalStorage } from "./hooks/use-local-storage";
import { useTelegram } from "./hooks/use-telegram";
import './style.css'
import type { Expense, RecurringExpense, Meta } from "./types";
import { applyMonthlyRecurrings } from "./utils/recurrence";

function App() {
  const { tg, user } = useTelegram();
  const [expenses, setExpenses] = useLocalStorage<Expense[]>("expenses_v1", []);
  const [recurrings, setRecurrings] = useLocalStorage<RecurringExpense[]>(
    "recurrings_v1",
    []
  );
  const [meta, setMeta] = useLocalStorage<Meta>("meta_v1", {
    lastApplied: null,
  });

  useEffect(() => {
    applyMonthlyRecurrings({ expenses, setExpenses, recurrings, meta, setMeta });
  }, []);

  return (
    <Main
      expenses={expenses}
      setExpenses={setExpenses}
      recurrings={recurrings}
      setRecurrings={setRecurrings}
      user={user}
      tg={tg}
    />
  );
}

export default App;
