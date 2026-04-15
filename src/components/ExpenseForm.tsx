import { Box, Button, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';

import { Expense } from '../types';

interface Props {
  onAdd: (expense: Expense) => void;
}

export const ExpenseForm: React.FC<Props> = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState<number | ''>('');

  const handleAdd = () => {
    if (!name || amount === '' || amount < 0) return;

    onAdd({ id: uuid(), name, amount: Number(amount) });
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
      <Button variant="contained" fullWidth onClick={handleAdd}>
        Добавить
      </Button>
    </Stack>
  );
};
