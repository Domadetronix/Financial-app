import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, ListItem, ListItemText, IconButton, Chip } from '@mui/material';
import React from 'react';

import { Expense } from '../types';

interface Props {
  expense: Expense;
  onDelete: (id: string) => void;
  onEdit: (expense: Expense) => void;
}

export const ExpenseItem: React.FC<Props> = ({ expense, onDelete, onEdit }) => {
  return (
    <ListItem
      sx={{
        border: '1px solid #ddd',
        borderRadius: 2,
        my: 1,
        paddingRight: '96px'
      }}
      secondaryAction={
        <>
          <IconButton onClick={() => onEdit(expense)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => onDelete(expense.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      }
    >
      <Box display={'flex'} width={'100%'} alignItems={'center'}>
        <ListItemText primary={expense.name} secondary={`${expense.amount} ₽`} />
        <Chip
          label={expense.type === 'monthly' ? 'Ежемесячная' : 'Разовая'}
          color={expense.type === 'monthly' ? 'error' : 'secondary'}
        />
      </Box>
    </ListItem>
  );
};
