import { Box, Typography, Button, Container, TextField, Stack } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';

import { ExpenseList } from '@/components/ExpenseList';

import { EditDialog } from '../components/EditDialog';
import { Expense } from '../types';
import { loadMonthlyExpenses, saveMonthlyExpenses } from '../utils/storage';

export const MonthlyExpensesPage: React.FC = () => {
  const [monthlyExpenses, setMonthlyExpenses] = useState<Expense[]>([]);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState<number | ''>('');

  useEffect(() => {
    setMonthlyExpenses(loadMonthlyExpenses());
  }, []);

  const handleAdd = () => {
    if (!name || amount === '') return;

    const newExpense: Expense = { id: uuid(), name, amount, type: 'monthly' };
    const updated = [...monthlyExpenses, newExpense];
    setMonthlyExpenses(updated);
    saveMonthlyExpenses(updated);
  };

  const handleDelete = (id: string) => {
    const updated = monthlyExpenses.filter((e) => e.id !== id);
    setMonthlyExpenses(updated);
    saveMonthlyExpenses(updated);
  };

  const handleSaveEdit = (updated: Expense) => {
    const updatedList = monthlyExpenses.map((e) => (e.id === updated.id ? updated : e));
    setMonthlyExpenses(updatedList);
    saveMonthlyExpenses(updatedList);
  };

  return (
    <Container>
      <Stack sx={{ alignItems: 'center' }} spacing={2}>
        <Typography variant="h6">Ежемесячные траты</Typography>
        <Box display="flex" gap={2} width={'100%'}>
          <TextField
            label="Название траты"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Сумма"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
            sx={{ width: 120 }}
          />
        </Box>
        <Button variant="contained" fullWidth onClick={handleAdd}>
          Добавить
        </Button>
      </Stack>

      <ExpenseList expenses={monthlyExpenses} onDelete={handleDelete} onEdit={setEditingExpense} />

      {editingExpense && (
        <EditDialog
          expense={editingExpense}
          onClose={() => setEditingExpense(null)}
          onSave={handleSaveEdit}
          hideOption={true}
        />
      )}
    </Container>
  );
};
