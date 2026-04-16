import PaidIcon from '@mui/icons-material/Paid';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  ListItemButton,
  MenuItem,
  Select,
  TextField,
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
  onUpdate: (expense: GroupEventExpense) => void;
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
  onToggleTransferred,
  onUpdate
}: Props) {
  const [detailOpen, setDetailOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editParticipantIds, setEditParticipantIds] = useState<string[]>([]);
  const [editPaidById, setEditPaidById] = useState('');

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

  const handleOpen = () => {
    setEditName(expense.name);
    setEditAmount(String(expense.amount));
    setEditParticipantIds([...expense.participantIds]);
    setEditPaidById(expense.paidById);
    setDetailOpen(true);
  };

  const handleSave = () => {
    const amount = parseFloat(editAmount);
    if (!editName.trim() || isNaN(amount) || amount <= 0 || editParticipantIds.length === 0) return;
    onUpdate({ ...expense, name: editName.trim(), amount, participantIds: editParticipantIds, paidById: editPaidById });
    setDetailOpen(false);
  };

  const toggleParticipant = (id: string) => {
    setEditParticipantIds(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const shareStr = share % 1 === 0 ? String(share) : share.toFixed(2);

  return (
    <>
      {/* Элемент списка */}
      <ListItemButton
        onClick={handleOpen}
        sx={{
          opacity: dimmed ? 0.4 : 1,
          transition: 'opacity 0.2s',
          py: 0.75,
          borderBottom: '1px solid',
          borderColor: 'divider',
          alignItems: 'flex-start'
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography
              variant="body2"
              fontWeight={isMyExpense ? 600 : 400}
              sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {expense.name}
            </Typography>
            <Typography variant="body2" fontWeight={600} sx={{ flexShrink: 0 }}>
              {expense.amount} ₽
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={0.5} mt={0.25} flexWrap="wrap">
            <PaidIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {paidByName} · {shareStr} ₽/чел
            </Typography>
            {isTransferred && (
              <Chip
                label="Перевёл"
                size="small"
                color="success"
                sx={{ height: 16, fontSize: 10 }}
              />
            )}
          </Box>
        </Box>
      </ListItemButton>

      {/* Диалог деталей и редактирования */}
      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Трата</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
          <TextField
            label="Название"
            value={editName}
            onChange={e => setEditName(e.target.value)}
            size="small"
            fullWidth
          />
          <TextField
            label="Сумма"
            value={editAmount}
            onChange={e => setEditAmount(e.target.value)}
            slotProps={{ htmlInput: { inputMode: 'decimal' } }}
            size="small"
            fullWidth
          />
          <Box>
            <Typography variant="caption" color="text.secondary">
              Участники
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={0.5} mt={0.5}>
              {allMembers.map(m => (
                <Chip
                  key={m.id}
                  label={m.name}
                  size="small"
                  variant={editParticipantIds.includes(m.id) ? 'filled' : 'outlined'}
                  color={editParticipantIds.includes(m.id) ? 'primary' : 'default'}
                  onClick={() => toggleParticipant(m.id)}
                />
              ))}
            </Box>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Оплатил
            </Typography>
            <Select
              value={editPaidById}
              onChange={e => setEditPaidById(e.target.value)}
              size="small"
              fullWidth
              sx={{ mt: 0.5 }}
            >
              {allMembers.map(m => (
                <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>
              ))}
            </Select>
          </Box>
        </DialogContent>
        <DialogActions sx={{ flexDirection: 'column', alignItems: 'stretch', gap: 1, px: 2, pb: 2 }}>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!editName.trim() || !editAmount || editParticipantIds.length === 0}
            fullWidth
          >
            Сохранить
          </Button>
          {canMarkTransferred && (
            <>
              <Divider />
              <Button
                variant={isTransferred ? 'outlined' : 'contained'}
                color="success"
                onClick={() => { onToggleTransferred(expense.id, !isTransferred); setDetailOpen(false); }}
                fullWidth
              >
                {isTransferred ? 'Отменить перевод' : 'Я перевёл'}
              </Button>
            </>
          )}
          {canDelete && (
            <Button color="error" onClick={() => setConfirmDeleteOpen(true)} fullWidth>
              Удалить трату
            </Button>
          )}
          <Button onClick={() => setDetailOpen(false)} fullWidth>
            Закрыть
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Удалить трату?"
        description={`«${expense.name}» будет удалена безвозвратно.`}
        onConfirm={() => {
          setConfirmDeleteOpen(false);
          setDetailOpen(false);
          onDelete(expense.id);
        }}
        onCancel={() => setConfirmDeleteOpen(false)}
      />
    </>
  );
}
