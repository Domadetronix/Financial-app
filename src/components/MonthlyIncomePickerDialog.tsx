import {
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Typography
} from '@mui/material';
import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';

import { StyledDialog } from '@/styled-components/StyledDialog';

import { IncomeEntry } from '../types';

interface Props {
  open: boolean;
  onClose: () => void;
  monthlyIncomes: IncomeEntry[];
  onAdd: (entries: IncomeEntry[]) => void;
}

export const MonthlyIncomePickerDialog: React.FC<Props> = ({
  open,
  onClose,
  monthlyIncomes,
  onAdd
}) => {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleAdd = () => {
    const toAdd: IncomeEntry[] = monthlyIncomes
      .filter((e) => selected.has(e.id))
      .map((e) => ({ ...e, id: uuid() }));
    onAdd(toAdd);
    setSelected(new Set());
    onClose();
  };

  return (
    <StyledDialog open={open} onClose={onClose}>
      <DialogTitle>Добавить из регулярных</DialogTitle>
      <DialogContent>
        {monthlyIncomes.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Список регулярных доходов пуст
          </Typography>
        ) : (
          <List disablePadding>
            {monthlyIncomes.map((e) => (
              <ListItem
                key={e.id}
                disablePadding
                onClick={() => toggle(e.id)}
                sx={{ cursor: 'pointer' }}
              >
                <Checkbox checked={selected.has(e.id)} />
                <ListItemText primary={e.name} secondary={`${e.amount} ₽`} />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button variant="contained" onClick={handleAdd} disabled={selected.size === 0}>
          Добавить выбранные
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};
