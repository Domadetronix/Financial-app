import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button
} from '@mui/material';
import React, { useState } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (value: number) => void;
  currentIncome: number;
}

export const IncomeDialog: React.FC<Props> = ({ open, onClose, onSave, currentIncome }) => {
  const [income, setIncome] = useState(currentIncome);

  const handleSave = () => {
    onSave(income);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Редактировать доход</DialogTitle>
      <DialogContent>
        <TextField
          label="Доход за месяц"
          type="number"
          value={income}
          onChange={(e) => setIncome(Number(e.target.value))}
          fullWidth
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button onClick={handleSave} variant="contained">
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};
