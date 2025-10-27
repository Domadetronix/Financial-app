import {
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import React, { useState, useEffect } from 'react';

import { StyledDialog } from '@/styled-components/StyledDialog';

import { Expense } from '../types';

interface Props {
  expense: Expense | null;
  onClose: () => void;
  onSave: (expense: Expense) => void;
}

export const EditDialog: React.FC<Props> = ({ expense, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState<'monthly' | 'one-time'>('one-time');

  useEffect(() => {
    if (expense) {
      setName(expense.name);
      setAmount(expense.amount);
      setType(expense.type);
    }
  }, [expense]);

  if (!expense) return null;

  const handleSave = () => {
    onSave({ ...expense, name, amount, type });
    onClose();
  };

  return (
    <StyledDialog open={!!expense} onClose={onClose}>
      <DialogTitle>Редактирование траты</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', pt: 1 }}>
        <TextField
          label="Название"
          sx={{ marginTop: '15px' }}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Сумма"
          sx={{ marginTop: '15px' }}
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <ToggleButtonGroup
          value={type}
          exclusive
          onChange={(_, val) => val && setType(val)}
          sx={{ justifyContent: 'center', marginTop: '15px' }}
        >
          <ToggleButton sx={{ width: '50%' }} value="monthly">
            Ежемесячная
          </ToggleButton>
          <ToggleButton sx={{ width: '50%' }} value="one-time">
            Разовая
          </ToggleButton>
        </ToggleButtonGroup>
      </DialogContent>
      <DialogActions sx={{ px: 3 }}>
        <Button sx={{ width: '50%' }} onClick={onClose} variant="contained" color="warning">
          Отмена
        </Button>
        <Button sx={{ width: '50%' }} onClick={handleSave} variant="contained" color="success">
          Сохранить
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};
