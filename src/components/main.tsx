/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';

import type { TelegramWebApp } from '../hooks/use-telegram';
import type { Expense, RecurringExpense } from '../types';

interface MainProps {
  expenses: Expense[];
  setExpenses: (e: Expense[]) => void;
  recurrings: RecurringExpense[];
  setRecurrings: (r: RecurringExpense[]) => void;
  user: any;
  tg: TelegramWebApp | null;
}

const Main: React.FC<MainProps> = ({ expenses, setExpenses, user }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number>(0);

  const handleAdd = () => {
    if (!title || !amount) return;
    const newExpense: Expense = {
      id: crypto.randomUUID(),
      title,
      category: 'Прочее',
      amount,
      date: new Date().toISOString().split('T')[0],
      type: 'once'
    };
    setExpenses([...expenses, newExpense]);
    setTitle('');
    setAmount(0);
  };

  return (
    <div
      style={{
        width: '100vw',
        paddingTop: '64px',
        backgroundColor: '#1E5945',
        color: 'white',
        padding: 16
      }}
    >
      <h2>Привет, {user?.first_name || 'гость'} 👋</h2>

      <div style={{ width: '100%', marginTop: 12 }}>
        <input
          type="text"
          placeholder="Название траты"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: '100%',
            marginBottom: 8,
            padding: '6px 8px',
            borderRadius: '6px'
          }}
        />
        <input
          type="number"
          placeholder="Сумма"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          style={{
            width: '100%',
            marginBottom: 8,
            padding: '6px 8px',
            borderRadius: '6px'
          }}
        />
        <button onClick={handleAdd}>Добавить</button>
      </div>

      <ul style={{ marginTop: 20 }}>
        {expenses.map((ex) => (
          <li key={ex.id}>
            {ex.title} — {ex.amount} ₽ ({ex.date})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Main;
