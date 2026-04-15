import { Box, Button, TextField } from '@mui/material';
import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';

import { Expense } from '../types';

interface Props {
  onAdd: (expense: Expense) => void;
}

export const ExpenseForm: React.FC<Props> = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  const handleAdd = () => {
    const parsed = parseFloat(amount);
    if (!name || isNaN(parsed) || parsed < 0) return;

    onAdd({ id: uuid(), name, amount: parsed });
    setName('');
    setAmount('');
  };

  return (
    <Box>
      <Box display="flex" gap={1} mb={1}>
        <TextField
          label="Название"
          value={name}
          onChange={(e) => setName(e.target.value)}
          size="small"
          fullWidth
        />
        <TextField
          label="Сумма"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          slotProps={{ htmlInput: { inputMode: 'decimal' } }}
          size="small"
          sx={{ width: 120 }}
        />
      </Box>
      <Button variant="contained" fullWidth onClick={handleAdd} sx={{ mb: 1 }}>
        Добавить
      </Button>
    </Box>
  );
};
