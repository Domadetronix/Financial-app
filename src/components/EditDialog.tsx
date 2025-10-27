import { Dialog, DialogTitle, DialogContent, TextField, Button, Box } from '@mui/material';
import React, { useState } from 'react';

import { Expense } from '../types';

interface Props {
  expense: Expense;
  onClose: () => void;
  onSave: (expense: Expense) => void;
}

export const EditDialog: React.FC<Props> = ({ expense, onClose, onSave }) => {
  const [name, setName] = useState(expense.name);
  const [amount, setAmount] = useState<number>(expense.amount);
  const [type, setType] = useState<'monthly' | 'one-time'>(expense.type);

  const handleSave = () => {
    onSave({ ...expense, name, amount, type });
    onClose();
  };

  return (
    <Dialog open onClose={onClose}>
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
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant={type === 'monthly' ? 'contained' : 'outlined'}
              sx={{ width: '50%' }}
              color="error"
              onClick={() => setType('monthly')}
            >
              Ежемесячная
            </Button>
            <Button
              variant={type === 'one-time' ? 'contained' : 'outlined'}
              color="secondary"
              onClick={() => setType('one-time')}
            >
              Разовая
            </Button>
          </Box>
          <Button variant="contained" sx={{ width: '50%' }} onClick={handleSave}>
            Сохранить
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
