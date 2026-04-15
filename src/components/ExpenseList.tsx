import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Box, IconButton, List, Popover, Typography } from '@mui/material';
import React, { useState } from 'react';

import { Expense, isMonthExpense } from '../types';
import { ExpenseItem } from './ExpenseItem';

interface Props {
  expenses: Expense[];
  onDelete: (id: string) => void;
  onEdit: (expense: Expense) => void;
  onClose?: (id: string) => void;
}

export const ExpenseList: React.FC<Props> = ({ expenses, onDelete, onEdit, onClose }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const sorted = onClose
    ? [...expenses].sort((a, b) => {
        const aClosed = isMonthExpense(a) && a.closed ? 1 : 0;
        const bClosed = isMonthExpense(b) && b.closed ? 1 : 0;
        return aClosed - bClosed;
      })
    : expenses;

  const closedSum = expenses.reduce(
    (sum, e) => (isMonthExpense(e) && e.closed ? sum + e.amount : sum),
    0
  );
  const openSum = expenses.reduce(
    (sum, e) => (!isMonthExpense(e) || !e.closed ? sum + e.amount : sum),
    0
  );

  return (
    <>
      {onClose && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
          <Typography variant="subtitle1">Траты</Typography>
          <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
            <InfoOutlinedIcon fontSize="small" />
          </IconButton>
          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Box sx={{ p: 2, minWidth: 200 }}>
              <Typography variant="body2">Предстоит оплатить: {openSum} ₽</Typography>
              <Typography variant="body2">Закрыто: {closedSum} ₽</Typography>
            </Box>
          </Popover>
        </Box>
      )}
      <List>
        {sorted.map((e) => (
          <ExpenseItem key={e.id} expense={e} onDelete={onDelete} onEdit={onEdit} onClose={onClose} />
        ))}
      </List>
    </>
  );
};
