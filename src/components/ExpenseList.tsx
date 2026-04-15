import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
  Box,
  IconButton,
  List,
  Popover,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material';
import React, { useState } from 'react';

import { ExpenseItem } from './ExpenseItem';

import { Expense, isMonthExpense } from '../types';

type SortBy = 'name' | 'amount';
type SortDir = 'asc' | 'desc';

interface Props {
  expenses: Expense[];
  onDelete: (id: string) => void;
  onEdit: (expense: Expense) => void;
  onClose?: (id: string) => void;
}

export const ExpenseList: React.FC<Props> = ({ expenses, onDelete, onEdit, onClose }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [sortBy, setSortBy] = useState<SortBy | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const handleSortBy = (_: React.MouseEvent, value: SortBy | null) => {
    setSortBy(value);
  };

  const toggleDir = () => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));

  const sorted = (() => {
    const result = [...expenses];

    if (sortBy) {
      result.sort((a, b) => {
        const cmp = sortBy === 'name' ? a.name.localeCompare(b.name, 'ru') : a.amount - b.amount;
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }

    if (onClose) {
      result.sort((a, b) => {
        const aClosed = isMonthExpense(a) && a.closed ? 1 : 0;
        const bClosed = isMonthExpense(b) && b.closed ? 1 : 0;
        return aClosed - bClosed;
      });
    }

    return result;
  })();

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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1, flexWrap: 'wrap' }}>
          <Typography variant="subtitle1">Траты</Typography>

          <ToggleButtonGroup
            size="small"
            exclusive
            value={sortBy}
            onChange={handleSortBy}
            sx={{ '& .MuiToggleButton-root': { py: 0.25, px: 1, fontSize: '0.75rem' } }}
          >
            <ToggleButton value="name">А-Я</ToggleButton>
            <ToggleButton value="amount">Сумма</ToggleButton>
          </ToggleButtonGroup>

          <IconButton
            sx={{ mr: 'auto' }}
            size="small"
            onClick={toggleDir}
            disabled={!sortBy}
            title={sortDir === 'asc' ? 'По возрастанию' : 'По убыванию'}
          >
            {sortDir === 'asc' ? (
              <ArrowUpwardIcon fontSize="small" />
            ) : (
              <ArrowDownwardIcon fontSize="small" />
            )}
          </IconButton>

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
          <ExpenseItem
            key={e.id}
            expense={e}
            onDelete={onDelete}
            onEdit={onEdit}
            onClose={onClose}
          />
        ))}
      </List>
    </>
  );
};
