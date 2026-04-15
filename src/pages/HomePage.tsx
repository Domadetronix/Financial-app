import { Box, Button, Container } from '@mui/material';
import React, { useEffect, useState } from 'react';

import { EditDialog } from '../components/EditDialog';
import { ExpenseForm } from '../components/ExpenseForm';
import { ExpenseList } from '../components/ExpenseList';
import { Header } from '../components/Header';
import { IncomeDialog } from '../components/IncomeDialog';
import { MonthlyPickerDialog } from '../components/MonthlyPickerDialog';
import { MonthSelector } from '../components/MonthSelector';
import { Expense, MonthExpense } from '../types';
import {
  loadExpenses,
  loadIncome,
  loadMonthlyExpenses,
  saveExpenses,
  saveIncome
} from '../utils/storage';

interface Props {
  userName: string;
}

export const HomePage: React.FC<Props> = ({ userName }) => {
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState<string>(today.toISOString().slice(0, 7));
  const [incomeByMonth, setIncomeByMonth] = useState<Record<string, number>>({});
  const [isIncomeDialogOpen, setIncomeDialogOpen] = useState(false);
  const [expensesByMonth, setExpensesByMonth] = useState<Record<string, MonthExpense[]>>({});
  const [monthlyExpenses, setMonthlyExpenses] = useState<Expense[]>([]);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [monthSelectorOpen, setMonthSelectorOpen] = useState(false);
  const [monthlyPickerOpen, setMonthlyPickerOpen] = useState(false);

  useEffect(() => {
    setIncomeByMonth({ [currentMonth]: loadIncome(currentMonth) });
    setExpensesByMonth(loadExpenses());
    setMonthlyExpenses(loadMonthlyExpenses());
  }, []);

  const handleAddExpense = (expense: Expense) => {
    const monthExpense: MonthExpense = { ...expense, closed: false };
    setExpensesByMonth((prev) => {
      const updated = { ...prev, [currentMonth]: [...(prev[currentMonth] || []), monthExpense] };
      saveExpenses(updated);
      return updated;
    });
  };

  const handleAddFromMonthly = (expenses: MonthExpense[]) => {
    setExpensesByMonth((prev) => {
      const updated = { ...prev, [currentMonth]: [...(prev[currentMonth] || []), ...expenses] };
      saveExpenses(updated);
      return updated;
    });
  };

  const handleDelete = (id: string) => {
    setExpensesByMonth((prev) => {
      const updated = {
        ...prev,
        [currentMonth]: (prev[currentMonth] || []).filter((e) => e.id !== id)
      };
      saveExpenses(updated);
      return updated;
    });
  };

  const handleSaveEdit = (updated: Expense) => {
    setExpensesByMonth((prev) => {
      const updatedList = (prev[currentMonth] || []).map((e) =>
        e.id === updated.id ? { ...updated, closed: e.closed } : e
      );
      const updatedData = { ...prev, [currentMonth]: updatedList };
      saveExpenses(updatedData);
      return updatedData;
    });
  };

  const handleToggleClose = (id: string) => {
    setExpensesByMonth((prev) => {
      const updatedList = (prev[currentMonth] || []).map((e) =>
        e.id === id ? { ...e, closed: !e.closed } : e
      );
      const updated = { ...prev, [currentMonth]: updatedList };
      saveExpenses(updated);
      return updated;
    });
  };

  const handleEditIncome = (val: number) => {
    setIncomeByMonth((prev) => {
      const updated = { ...prev, [currentMonth]: val };
      saveIncome(currentMonth, val);
      return updated;
    });
    setIncomeDialogOpen(false);
  };

  const generateFiveMonths = (): string[] => {
    const months: string[] = [];
    for (let i = -1; i <= 4; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() + i, 1);
      months.push(date.toISOString().slice(0, 7));
    }
    return months;
  };

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
        onIncomeClick={() => setIncomeDialogOpen(true)}
        userName={userName}
      />

      <Box sx={{ mb: 3 }}>
        <ExpenseForm onAdd={handleAddExpense} />
        <Button
          variant="outlined"
          fullWidth
          sx={{ mt: 1 }}
          onClick={() => setMonthlyPickerOpen(true)}
        >
          + Из регулярных
        </Button>
        <ExpenseList
          expenses={currentMonthExpenses}
          onDelete={handleDelete}
          onEdit={setEditingExpense}
          onClose={handleToggleClose}
        />
      </Box>

      <MonthSelector
        open={monthSelectorOpen}
        onClose={() => setMonthSelectorOpen(false)}
        months={generateFiveMonths()}
        selected={currentMonth}
        onSelect={(m) => {
          setCurrentMonth(m);
          setMonthSelectorOpen(false);
        }}
      />

      <MonthlyPickerDialog
        open={monthlyPickerOpen}
        onClose={() => setMonthlyPickerOpen(false)}
        monthlyExpenses={monthlyExpenses}
        onAdd={handleAddFromMonthly}
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
