import { Box, TextField, Button, Stack } from '@mui/material';
import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';

import { Expense } from '../types';

interface Props {
  onAdd: (expense: Expense) => void;
}

export const ExpenseForm: React.FC<Props> = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState<number>(0);

  const handleAdd = (type: 'monthly' | 'one-time') => {
    if (!name || amount <= 0) return;
    onAdd({ id: uuid(), name, amount, type });
    setName('');
    setAmount(0);
  };

  return (
    <Stack spacing={2}>
      <Box display="flex" gap={2}>
        <TextField
          label="Наименование"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />
        <TextField
          label="Стоимость"
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          sx={{ width: 150 }}
        />
      </Box>
      <Box display="flex" gap={2}>
        <Button variant="contained" color="error" onClick={() => handleAdd('monthly')} fullWidth>
          Ежемесячная
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleAdd('one-time')}
          fullWidth
        >
          Разовая
        </Button>
      </Box>
    </Stack>
  );
};
