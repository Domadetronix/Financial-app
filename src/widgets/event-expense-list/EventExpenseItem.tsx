import DeleteIcon from '@mui/icons-material/Delete';
import PaidIcon from '@mui/icons-material/Paid';
import PaymentsIcon from '@mui/icons-material/Payments';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import {
  Box,
  Chip,
  IconButton,
  ListItem,
  ListItemText,
  Tooltip,
  Typography
} from '@mui/material';
import { useState } from 'react';

import { GroupEventExpense, GroupMember, MockMember } from '@/shared/types';
import { ConfirmDialog } from '@/shared/ui';

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
  canDelete: boolean;
  dimmed: boolean;
  onDelete: (id: string) => void;
  onToggleTransferred: (expenseId: string, transferred: boolean) => void;
}

export function EventExpenseItem({
  expense,
  realMembers,
  mockMembers,
  memberDisplayNames,
  currentUserId,
  canDelete,
  dimmed,
  onDelete,
  onToggleTransferred
}: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);

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
  const canMarkTransferred = isMyExpense && currentUserId !== expense.paidById;
  const isTransferred = (expense.transferredByIds ?? []).includes(currentUserId);

  return (
    <>
      <ListItem
        disablePadding
        sx={{
          opacity: dimmed ? 0.4 : 1,
          transition: 'opacity 0.2s',
          py: 0.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
          pr: canDelete ? '72px' : canMarkTransferred ? '40px' : '8px'
        }}
        secondaryAction={
          <Box display="flex" alignItems="center">
            {canMarkTransferred && (
              <Tooltip title={isTransferred ? 'Я перевёл (отменить)' : 'Я перевёл'}>
                <IconButton
                  size="small"
                  onClick={() => onToggleTransferred(expense.id, !isTransferred)}
                  color={isTransferred ? 'success' : 'default'}
                  sx={{ mr: canDelete ? 0 : -1 }}
                >
                  {isTransferred ? (
                    <PaymentsIcon fontSize="small" />
                  ) : (
                    <PaymentsOutlinedIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
            )}
            {canDelete && (
              <IconButton
                edge="end"
                size="small"
                onClick={() => setConfirmOpen(true)}
                sx={{ mr: -1 }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
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

      <ConfirmDialog
        open={confirmOpen}
        title="Удалить трату?"
        description={`«${expense.name}» будет удалена безвозвратно.`}
        onConfirm={() => {
          setConfirmOpen(false);
          onDelete(expense.id);
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
