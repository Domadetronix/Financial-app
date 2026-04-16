import DeleteIcon from '@mui/icons-material/Delete';
import PaidIcon from '@mui/icons-material/Paid';
import {
  Box,
  Chip,
  IconButton,
  ListItem,
  ListItemText,
  Tooltip,
  Typography
} from '@mui/material';
import React from 'react';

import { GroupEventExpense, GroupMember, MockMember } from '../types';

interface AllMember {
  id: string;
  name: string;
}

interface Props {
  expense: GroupEventExpense;
  realMembers: GroupMember[];
  mockMembers: MockMember[];
  memberDisplayNames: Record<string, string>;
  currentUserId: string;
  dimmed: boolean;
  onDelete: (id: string) => void;
}

export const EventExpenseItem: React.FC<Props> = ({
  expense,
  realMembers,
  mockMembers,
  memberDisplayNames,
  currentUserId,
  dimmed,
  onDelete
}) => {
  const allMembers: AllMember[] = [
    ...realMembers.map(m => ({
      id: m.telegramId,
      name: memberDisplayNames[m.telegramId] ?? m.name
    })),
    ...mockMembers.map(m => ({
      id: m.id,
      name: memberDisplayNames[m.id] ?? m.name
    }))
  ];

  const getName = (id: string) => allMembers.find(m => m.id === id)?.name ?? id;

  const paidByName = getName(expense.paidById);
  const share =
    expense.participantIds.length > 0
      ? expense.amount / expense.participantIds.length
      : expense.amount;

  const isMyExpense = expense.participantIds.includes(currentUserId);

  return (
    <ListItem
      disablePadding
      sx={{
        opacity: dimmed ? 0.4 : 1,
        transition: 'opacity 0.2s',
        py: 0.5,
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}
      secondaryAction={
        <IconButton
          edge="end"
          size="small"
          onClick={() => onDelete(expense.id)}
          sx={{ mr: -1 }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      }
    >
      <ListItemText
        disableTypography
        primary={
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body2" fontWeight={isMyExpense ? 600 : 400} sx={{ flex: 1 }}>
              {expense.name}
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {expense.amount} ₽
            </Typography>
          </Box>
        }
        secondary={
          <Box mt={0.5}>
            <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
              <Tooltip title="Оплатил">
                <PaidIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              </Tooltip>
              <Typography variant="caption" color="text.secondary">
                {paidByName} · по {share % 1 === 0 ? share : share.toFixed(2)} ₽
              </Typography>
            </Box>
            <Box display="flex" flexWrap="wrap" gap={0.5}>
              {expense.participantIds.map(id => (
                <Chip
                  key={id}
                  label={getName(id)}
                  size="small"
                  variant={id === currentUserId ? 'filled' : 'outlined'}
                  color={id === currentUserId ? 'primary' : 'default'}
                  sx={{ height: 18, fontSize: 11 }}
                />
              ))}
            </Box>
          </Box>
        }
      />
    </ListItem>
  );
};
