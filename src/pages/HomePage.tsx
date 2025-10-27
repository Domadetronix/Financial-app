import { Box, Container } from '@mui/material';
import React, { useState, useEffect } from 'react';

import { ExpenseList } from '@/components/ExpenseList';
import { IncomeDialog } from '@/components/IncomeDialog';

import { EditDialog } from '../components/EditDialog';
import { ExpenseForm } from '../components/ExpenseForm';
import { Header } from '../components/Header';
import { MonthSelector } from '../components/MonthSelector';
import { Expense } from '../types';
import {
  loadExpenses,
  loadIncome,
  saveExpenses,
  saveIncome,
  loadMonthlyExpenses
} from '../utils/storage';

export const HomePage: React.FC = () => {
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState<string>(today.toISOString().slice(0, 7));
  const [incomeByMonth, setIncomeByMonth] = useState<Record<string, number>>({});
  const [isIncomeDialogOpen, setIncomeDialogOpen] = useState(false);
  const [expensesByMonth, setExpensesByMonth] = useState<Record<string, Expense[]>>({});
  const [monthlyExpenses, setMonthlyExpenses] = useState<Expense[]>([]);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [monthSelectorOpen, setMonthSelectorOpen] = useState(false);

  useEffect(() => {
    setIncomeByMonth({ [currentMonth]: loadIncome(currentMonth) });
    setExpensesByMonth(loadExpenses());
    setMonthlyExpenses(loadMonthlyExpenses());
  }, []);

  useEffect(() => {
    setExpensesByMonth((prev) => {
      if (!prev[currentMonth]) {
        return { ...prev, [currentMonth]: [...monthlyExpenses] };
      }
      return prev;
    });
  }, [currentMonth, monthlyExpenses]);

  const handleAddExpense = (expense: Expense) => {
    setExpensesByMonth((prev) => {
      const monthExpenses = prev[currentMonth] || [];
      const updatedMonthExpenses = [...monthExpenses, expense];
      const updated = { ...prev, [currentMonth]: updatedMonthExpenses };
      saveExpenses(updated);
      return updated;
    });
  };

  const handleDelete = (id: string) => {
    setExpensesByMonth((prev) => {
      const monthExpenses = prev[currentMonth] || [];
      const updatedMonthExpenses = monthExpenses.filter((e) => e.id !== id);
      const updated = { ...prev, [currentMonth]: updatedMonthExpenses };
      saveExpenses(updated);
      return updated;
    });
  };

  const handleSaveEdit = (updated: Expense) => {
    setExpensesByMonth((prev) => {
      const monthExpenses = prev[currentMonth] || [];
      const updatedMonthExpenses = monthExpenses.map((e) => (e.id === updated.id ? updated : e));
      const updatedData = { ...prev, [currentMonth]: updatedMonthExpenses };
      saveExpenses(updatedData);
      return updatedData;
    });
  };

  const handleIncomeClick = () => {
    setIncomeDialogOpen(true);
  };

  const handleEditIncome = (val: number) => {
    setIncomeByMonth((prev) => {
      const updated = { ...prev, [currentMonth]: val };
      saveIncome(currentMonth, val);
      return updated;
    });
    setIncomeDialogOpen(false);
  };

  const generateFiveMonths = () => {
    const months: string[] = [];
    for (let i = -1; i <= 4; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() + i, 1);
      const monthStr = date.toISOString().slice(0, 7);
      months.push(monthStr);
    }
    return months;
  };

  const months = generateFiveMonths();
  const currentMonthExpenses = expensesByMonth[currentMonth] || [];
  const remaining =
    (incomeByMonth[currentMonth] || 0) - currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <Container>
      <Header
        income={incomeByMonth[currentMonth] || 0}
        remaining={remaining}
        currentMonth={currentMonth}
        onMonthClick={() => setMonthSelectorOpen(true)}
        onIncomeClick={handleIncomeClick}
      />

      <Box sx={{ mb: 3 }}>
        <ExpenseForm onAdd={handleAddExpense} />
        <ExpenseList
          expenses={currentMonthExpenses}
          onDelete={handleDelete}
          onEdit={setEditingExpense}
        />
      </Box>
      <MonthSelector
        open={monthSelectorOpen}
        onClose={() => setMonthSelectorOpen(false)}
        months={months}
        selected={currentMonth}
        onSelect={(m) => {
          setCurrentMonth(m);
          setMonthSelectorOpen(false);
        }}
      />

      {editingExpense && (
        <EditDialog
          expense={editingExpense}
          onClose={() => setEditingExpense(null)}
          onSave={handleSaveEdit}
        />
      )}
      <IncomeDialog
        open={isIncomeDialogOpen}
        onClose={() => setIncomeDialogOpen(false)}
        onSave={handleEditIncome}
        currentIncome={incomeByMonth[currentMonth]}
      />
    </Container>
  );
};
