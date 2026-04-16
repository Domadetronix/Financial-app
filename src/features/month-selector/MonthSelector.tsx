import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select
} from '@mui/material';
import { useEffect, useState } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  selected: string;
  onSelect: (month: string) => void;
}

const MONTHS_RU = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 6 }, (_, i) => currentYear - 3 + i);

export function MonthSelector({ open, onClose, selected, onSelect }: Props) {
  const [year, setYear] = useState<number>(currentYear);
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);

  useEffect(() => {
    if (selected) {
      const [y, m] = selected.split('-').map(Number);
      setYear(y);
      setMonth(m);
    }
  }, [selected, open]);

  const handleApply = () => {
    const mm = String(month).padStart(2, '0');
    onSelect(`${year}-${mm}`);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Выберите период</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
          <Select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            fullWidth
            size="small"
          >
            {MONTHS_RU.map((name, i) => (
              <MenuItem key={i + 1} value={i + 1}>
                {name}
              </MenuItem>
            ))}
          </Select>
          <Select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            size="small"
            sx={{ minWidth: 90 }}
          >
            {YEARS.map((y) => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button variant="contained" onClick={handleApply}>
          Применить
        </Button>
      </DialogActions>
    </Dialog>
  );
}
