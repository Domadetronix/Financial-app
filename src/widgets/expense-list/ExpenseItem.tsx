import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { Box, IconButton, ListItem, ListItemText } from '@mui/material';

import { Expense, isMonthExpense } from '@/shared/types';

interface Props {
  expense: Expense;
  onDelete: (id: string) => void;
  onEdit: (expense: Expense) => void;
  onClose?: (id: string) => void;
}

export function ExpenseItem({ expense, onDelete, onEdit, onClose }: Props) {
  const closed = isMonthExpense(expense) && expense.closed;

  return (
    <ListItem
      sx={{
        border: '1px solid #ddd',
        borderRadius: 2,
        my: 1,
        paddingRight: '96px',
        opacity: closed ? 0.5 : 1
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
      <Box display="flex" width="100%" alignItems="center" gap={1}>
        {onClose && (
          <IconButton size="small" onClick={() => onClose(expense.id)} sx={{ p: 0.5 }}>
            {closed ? <CheckCircleIcon color="success" /> : <RadioButtonUncheckedIcon />}
          </IconButton>
        )}
        <ListItemText
          primary={expense.name}
          secondary={`${expense.amount} ₽`}
          primaryTypographyProps={closed ? { sx: { textDecoration: 'line-through' } } : undefined}
        />
      </Box>
    </ListItem>
  );
}
