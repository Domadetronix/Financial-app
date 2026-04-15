import { Box, Button, DialogContent, DialogTitle, TextField } from '@mui/material';
import React, { useState } from 'react';

import { StyledDialog } from '@/styled-components/StyledDialog';

import { Expense } from '../types';

interface Props {
  expense: Expense;
  onClose: () => void;
  onSave: (expense: Expense) => void;
}

export const EditDialog: React.FC<Props> = ({ expense, onClose, onSave }) => {
  const [name, setName] = useState(expense.name);
  const [amount, setAmount] = useState<number>(expense.amount);

  const handleSave = () => {
    onSave({ ...expense, name, amount });
    onClose();
  };

  return (
    <StyledDialog open onClose={onClose}>
      <DialogTitle>Редактировать трату</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Название" value={name} onChange={(e) => setName(e.target.value)} />
          <TextField
            label="Сумма"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
          <Button variant="contained" fullWidth onClick={handleSave}>
            Сохранить
          </Button>
        </Box>
      </DialogContent>
    </StyledDialog>
  );
};
