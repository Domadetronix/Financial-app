import { Box, Button, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useState } from 'react';

import { Expense } from '@/shared/types';
import { StyledDialog } from '@/shared/ui';

interface Props {
  expense: Expense;
  onClose: () => void;
  onSave: (expense: Expense) => void;
}

export function EditDialog({ expense, onClose, onSave }: Props) {
  const [name, setName] = useState(expense.name);
  const [amount, setAmount] = useState(String(expense.amount));

  const handleSave = () => {
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed < 0) return;
    onSave({ ...expense, name, amount: parsed });
    onClose();
  };

  return (
    <StyledDialog open onClose={onClose}>
      <DialogTitle>Редактировать</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Название" value={name} onChange={(e) => setName(e.target.value)} />
          <TextField
            label="Сумма"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            slotProps={{ htmlInput: { inputMode: 'decimal' } }}
          />
          <Button variant="contained" fullWidth onClick={handleSave}>
            Сохранить
          </Button>
        </Box>
      </DialogContent>
    </StyledDialog>
  );
}
