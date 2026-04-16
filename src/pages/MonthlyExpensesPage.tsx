import { Box, Button, CircularProgress, Container, Divider, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';

import { EditDialog } from '../components/EditDialog';
import { ExpenseList } from '../components/ExpenseList';
import { IncomeEntryList } from '../components/IncomeEntryList';
import { useNotification } from '../contexts/NotificationContext';
import { loadAllData, saveMonthlyExpenses, saveMonthlyIncomes } from '../lib/db';
import { Expense, IncomeEntry } from '../types';

interface Props {
  userId: string;
}

export const MonthlyExpensesPage: React.FC<Props> = ({ userId }) => {
  const notify = useNotification();
  const [loading, setLoading] = useState(true);
  const [monthlyExpenses, setMonthlyExpenses] = useState<Expense[]>([]);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');

  const [monthlyIncomes, setMonthlyIncomes] = useState<IncomeEntry[]>([]);
  const [editingIncome, setEditingIncome] = useState<IncomeEntry | null>(null);
  const [incomeName, setIncomeName] = useState('');
  const [incomeAmount, setIncomeAmount] = useState('');

  useEffect(() => {
    loadAllData(userId).then((data) => {
      setMonthlyExpenses(data.monthlyExpenses);
      setMonthlyIncomes(data.monthlyIncomes);
      setLoading(false);
    });
  }, [userId]);

  // ── Регулярные доходы ────────────────────────────────────────────────────

  const handleAddIncome = () => {
    const parsed = parseFloat(incomeAmount);
    if (!incomeName || isNaN(parsed) || parsed < 0) return;
    const entry: IncomeEntry = { id: uuid(), name: incomeName, amount: parsed };
    const updated = [...monthlyIncomes, entry];
    setMonthlyIncomes(updated);
    saveMonthlyIncomes(userId, updated);
    setIncomeName('');
    setIncomeAmount('');
    notify('Регулярный доход добавлен');
  };

  const handleDeleteIncome = (id: string) => {
    const updated = monthlyIncomes.filter((e) => e.id !== id);
    setMonthlyIncomes(updated);
    saveMonthlyIncomes(userId, updated);
    notify('Регулярный доход удалён');
  };

  const handleSaveIncomeEdit = (updated: IncomeEntry) => {
    const updatedList = monthlyIncomes.map((e) => (e.id === updated.id ? updated : e));
    setMonthlyIncomes(updatedList);
    saveMonthlyIncomes(userId, updatedList);
    setEditingIncome(null);
    notify('Регулярный доход сохранён');
  };

  // ── Регулярные траты ─────────────────────────────────────────────────────

  const handleAddExpense = () => {
    const parsed = parseFloat(expenseAmount);
    if (!expenseName || isNaN(parsed) || parsed < 0) return;
    const newExpense: Expense = { id: uuid(), name: expenseName, amount: parsed };
    const updated = [...monthlyExpenses, newExpense];
    setMonthlyExpenses(updated);
    saveMonthlyExpenses(userId, updated);
    setExpenseName('');
    setExpenseAmount('');
    notify('Регулярная трата добавлена');
  };

  const handleDeleteExpense = (id: string) => {
    const updated = monthlyExpenses.filter((e) => e.id !== id);
    setMonthlyExpenses(updated);
    saveMonthlyExpenses(userId, updated);
    notify('Регулярная трата удалена');
  };

  const handleSaveExpenseEdit = (updated: Expense) => {
    const updatedList = monthlyExpenses.map((e) => (e.id === updated.id ? updated : e));
    setMonthlyExpenses(updatedList);
    saveMonthlyExpenses(userId, updatedList);
    setEditingExpense(null);
    notify('Регулярная трата сохранена');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Typography variant="h6" mb={2}>
        Регулярные
      </Typography>

      {/* ── Доходы ── */}
      <Stack spacing={1} mb={2}>
        <Typography variant="subtitle2" color="text.secondary">
          Доходы
        </Typography>
        <Box display="flex" gap={1}>
          <TextField
            label="Название"
            value={incomeName}
            onChange={(e) => setIncomeName(e.target.value)}
            size="small"
            fullWidth
          />
          <TextField
            label="Сумма"
            value={incomeAmount}
            onChange={(e) => setIncomeAmount(e.target.value)}
            slotProps={{ htmlInput: { inputMode: 'decimal' } }}
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
            label="Название"
            value={expenseName}
            onChange={(e) => setExpenseName(e.target.value)}
            size="small"
            fullWidth
          />
          <TextField
            label="Сумма"
            value={expenseAmount}
            onChange={(e) => setExpenseAmount(e.target.value)}
            slotProps={{ htmlInput: { inputMode: 'decimal' } }}
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
