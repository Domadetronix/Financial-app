import { Box, TextField, Button, Stack } from '@mui/material';
import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';

import { Expense } from '../types';

interface Props {
  onAdd: (expense: Expense) => void;
}

export const ExpenseForm: React.FC<Props> = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState<number | ''>('');

  const handleAdd = (type: 'monthly' | 'one-time') => {
    if (!name || amount === '' || amount < 0) return;

    const expense: Expense = {
      id: uuid(),
      name,
      amount: Number(amount),
      type
    };

    onAdd(expense);

    setName('');
    setAmount('');
  };

  return (
    <Stack spacing={2}>
      <Box display="flex" gap={2}>
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
      <Box display="flex" gap={2}>
        <Button
          variant="contained"
          sx={{ width: '50%' }}
          color="error"
          onClick={() => handleAdd('monthly')}
        >
          Ежемесячная
        </Button>
        <Button
          variant="contained"
          sx={{ width: '50%' }}
          color="secondary"
          onClick={() => handleAdd('one-time')}
        >
          Разовая
        </Button>
      </Box>
    </Stack>
  );
};
