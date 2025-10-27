import { List } from '@mui/material';
import React from 'react';

import { ExpenseItem } from './ExpenseItem';

import { Expense } from '../types';

interface Props {
  expenses: Expense[];
  onDelete: (id: string) => void;
  onEdit: (expense: Expense) => void;
}

export const ExpenseList: React.FC<Props> = ({ expenses, onDelete, onEdit }) => {
  return (
    <List>
      {expenses.map((e) => (
        <ExpenseItem key={e.id} expense={e} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </List>
  );
};
