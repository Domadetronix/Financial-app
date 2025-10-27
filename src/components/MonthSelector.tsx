import { Dialog, DialogTitle, List, ListItemButton, ListItemText } from '@mui/material';
import React from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  months: string[];
  selected: string;
  onSelect: (month: string) => void;
}

export const MonthSelector: React.FC<Props> = ({ open, onClose, months, selected, onSelect }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Выберите месяц</DialogTitle>
    <List>
      {months.map((m) => (
        <ListItemButton key={m} selected={m === selected} onClick={() => onSelect(m)}>
          <ListItemText primary={m} />
        </ListItemButton>
      ))}
    </List>
  </Dialog>
);
