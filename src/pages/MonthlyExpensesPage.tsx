import { Box, Button, Container, Divider, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';

import { EditDialog } from '../components/EditDialog';
import { ExpenseList } from '../components/ExpenseList';
import { IncomeEntryList } from '../components/IncomeEntryList';
import { Expense, IncomeEntry } from '../types';
import {
  loadMonthlyExpenses,
  loadMonthlyIncomes,
  saveMonthlyExpenses,
  saveMonthlyIncomes
} from '../utils/storage';

export const MonthlyExpensesPage: React.FC = () => {
  const [monthlyExpenses, setMonthlyExpenses] = useState<Expense[]>([]);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState<number | ''>('');

  const [monthlyIncomes, setMonthlyIncomes] = useState<IncomeEntry[]>([]);
  const [editingIncome, setEditingIncome] = useState<IncomeEntry | null>(null);
  const [incomeName, setIncomeName] = useState('');
  const [incomeAmount, setIncomeAmount] = useState<number | ''>('');

  useEffect(() => {
    setMonthlyExpenses(loadMonthlyExpenses());
    setMonthlyIncomes(loadMonthlyIncomes());
  }, []);

  // ── Регулярные доходы ────────────────────────────────────────────────────

  const handleAddIncome = () => {
    if (!incomeName || incomeAmount === '') return;
    const entry: IncomeEntry = { id: uuid(), name: incomeName, amount: Number(incomeAmount) };
    const updated = [...monthlyIncomes, entry];
    setMonthlyIncomes(updated);
    saveMonthlyIncomes(updated);
    setIncomeName('');
    setIncomeAmount('');
  };

  const handleDeleteIncome = (id: string) => {
    const updated = monthlyIncomes.filter((e) => e.id !== id);
    setMonthlyIncomes(updated);
    saveMonthlyIncomes(updated);
  };

  const handleSaveIncomeEdit = (updated: IncomeEntry) => {
    const updatedList = monthlyIncomes.map((e) => (e.id === updated.id ? updated : e));
    setMonthlyIncomes(updatedList);
    saveMonthlyIncomes(updatedList);
    setEditingIncome(null);
  };

  // ── Регулярные траты ─────────────────────────────────────────────────────

  const handleAddExpense = () => {
    if (!expenseName || expenseAmount === '') return;
    const newExpense: Expense = { id: uuid(), name: expenseName, amount: Number(expenseAmount) };
    const updated = [...monthlyExpenses, newExpense];
    setMonthlyExpenses(updated);
    saveMonthlyExpenses(updated);
    setExpenseName('');
    setExpenseAmount('');
  };

  const handleDeleteExpense = (id: string) => {
    const updated = monthlyExpenses.filter((e) => e.id !== id);
    setMonthlyExpenses(updated);
    saveMonthlyExpenses(updated);
  };

  const handleSaveExpenseEdit = (updated: Expense) => {
    const updatedList = monthlyExpenses.map((e) => (e.id === updated.id ? updated : e));
    setMonthlyExpenses(updatedList);
    saveMonthlyExpenses(updatedList);
  };

  return (
    <Container>
      <Typography variant="h6" textAlign="center" mb={2}>
        Регулярные
      </Typography>

      {/* ── Доходы ── */}
      <Stack spacing={1} mb={2}>
        <Typography variant="subtitle2" color="text.secondary">
          Доходы
        </Typography>
        <Box display="flex" gap={1}>
          <TextField
            label="Источник"
            value={incomeName}
            onChange={(e) => setIncomeName(e.target.value)}
            size="small"
            fullWidth
          />
          <TextField
            label="Сумма"
            type="number"
            value={incomeAmount}
            onChange={(e) =>
              setIncomeAmount(e.target.value === '' ? '' : Number(e.target.value))
            }
            size="small"
            sx={{ width: 120 }}
          />
        </Box>
        <Button variant="contained" fullWidth onClick={handleAddIncome}>
          Добавить
        </Button>
      </Stack>

      <IncomeEntryList
        entries={monthlyIncomes}
        onDelete={handleDeleteIncome}
        onEdit={setEditingIncome}
      />

      <Divider sx={{ my: 2 }} />

      {/* ── Траты ── */}
      <Stack spacing={1} mb={2}>
        <Typography variant="subtitle2" color="text.secondary">
          Траты
        </Typography>
        <Box display="flex" gap={1}>
          <TextField
            label="Название траты"
            value={expenseName}
            onChange={(e) => setExpenseName(e.target.value)}
            size="small"
            fullWidth
          />
          <TextField
            label="Сумма"
            type="number"
            value={expenseAmount}
            onChange={(e) =>
              setExpenseAmount(e.target.value === '' ? '' : Number(e.target.value))
            }
            size="small"
            sx={{ width: 120 }}
          />
        </Box>
        <Button variant="contained" fullWidth onClick={handleAddExpense}>
          Добавить
        </Button>
      </Stack>

      <ExpenseList
        expenses={monthlyExpenses}
        onDelete={handleDeleteExpense}
        onEdit={setEditingExpense}
      />

      {editingIncome && (
        <EditDialog
          expense={editingIncome}
          onClose={() => setEditingIncome(null)}
          onSave={handleSaveIncomeEdit}
        />
      )}

      {editingExpense && (
        <EditDialog
          expense={editingExpense}
          onClose={() => setEditingExpense(null)}
          onSave={handleSaveExpenseEdit}
        />
      )}
    </Container>
  );
};
