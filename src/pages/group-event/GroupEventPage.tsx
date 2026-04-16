import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalculateIcon from '@mui/icons-material/Calculate';
import SettingsIcon from '@mui/icons-material/Settings';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  List,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';

import { AddEventExpenseModal } from '@/features/add-event-expense';
import {
  deleteGroup,
  leaveGroup,
  removeMemberFromGroup,
  saveEventGroupData,
  subscribeToEventGroupData,
  subscribeToGroup,
  updateGroupName,
  updateMemberDisplayNames,
  updateMockMembers
} from '@/shared/api';
import { EventGroupData, Group, GroupEventExpense, MockMember } from '@/shared/types';
import { EventExpenseItem } from '@/widgets/event-expense-list';
import { GroupSettingsDialog } from '@/widgets/group-settings';
import { SettlementDialog } from '@/widgets/settlement';

interface TelegramUser {
  id: number;
  first_name: string;
  photo_url?: string;
}

interface Props {
  groupId: string;
  userId: string;
  user: TelegramUser | null;
  onClose: () => void;
}

type FilterMode = 'mine' | 'all';

export function GroupEventPage({ groupId, userId, onClose }: Props) {
  const [group, setGroup] = useState<Group | null>(null);
  const [eventData, setEventData] = useState<EventGroupData | null>(null);
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [settlementOpen, setSettlementOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const unsubGroup = subscribeToGroup(groupId, setGroup);
    const unsubData = subscribeToEventGroupData(groupId, setEventData);
    return () => {
      unsubGroup();
      unsubData();
    };
  }, [groupId]);

  if (!group || !eventData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const realMembers = group.members;
  const mockMembers = group.mockMembers ?? [];
  const memberDisplayNames = group.memberDisplayNames ?? {};
  const isOwner = group.ownerTelegramId === userId;

  // ── Траты ───────────────────────────────────────────────────────────────────

  const handleAddExpense = (partial: Omit<GroupEventExpense, 'id' | 'createdAt'>) => {
    const expense: GroupEventExpense = {
      ...partial,
      id: uuid(),
      createdAt: new Date().toISOString()
    };
    saveEventGroupData(groupId, { expenses: [...eventData.expenses, expense] });
  };

  const handleUpdateExpense = (expense: GroupEventExpense) => {
    saveEventGroupData(groupId, {
      expenses: eventData.expenses.map(e => e.id === expense.id ? expense : e)
    });
  };

  const handleDeleteExpense = (id: string) => {
    saveEventGroupData(groupId, { expenses: eventData.expenses.filter(e => e.id !== id) });
  };

  const handleToggleTransferred = (expenseId: string, transferred: boolean) => {
    const updatedExpenses = eventData.expenses.map(e => {
      if (e.id !== expenseId) return e;
      const prev = e.transferredByIds ?? [];
      const updatedIds = transferred
        ? [...prev, userId]
        : prev.filter(id => id !== userId);
      return { ...e, transferredByIds: updatedIds };
    });
    saveEventGroupData(groupId, { expenses: updatedExpenses });
  };

  const handleCloseDebt = (toId: string) => {
    const updatedExpenses = eventData.expenses.map(e => {
      if (e.paidById !== toId || !e.participantIds.includes(userId)) return e;
      const prev = e.transferredByIds ?? [];
      if (prev.includes(userId)) return e;
      return { ...e, transferredByIds: [...prev, userId] };
    });
    saveEventGroupData(groupId, { expenses: updatedExpenses });
  };

  // ── Настройки ───────────────────────────────────────────────────────────────

  const handleRename = (name: string) => updateGroupName(groupId, name);

  const handleRemoveMember = (telegramId: string) => removeMemberFromGroup(groupId, telegramId);

  const handleUpdateMockMembers = (mocks: MockMember[]) => updateMockMembers(groupId, mocks);

  const handleUpdateDisplayName = (memberId: string, name: string) => {
    const updated = { ...memberDisplayNames, [memberId]: name };
    updateMemberDisplayNames(groupId, updated);
  };

  const handleLeave = async () => {
    await leaveGroup(groupId, userId);
    onClose();
  };

  const handleDelete = async () => {
    await deleteGroup(groupId);
    onClose();
  };

  // ── Фильтрация ──────────────────────────────────────────────────────────────

  const myExpenses = eventData.expenses.filter(e => e.participantIds.includes(userId));
  const totalExpenses = eventData.expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <Container sx={{ pt: 'max(env(safe-area-inset-top, 0px), 48px)', pb: '100px' }}>
      {/* Шапка */}
      <Paper sx={{ p: 2, mb: 2, position: 'relative', textAlign: 'center' }}>
        <IconButton size="small" onClick={onClose} sx={{ position: 'absolute', top: 8, left: 8 }}>
          <ArrowBackIcon />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => setSettingsOpen(true)}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <SettingsIcon />
        </IconButton>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {group.name}
        </Typography>
        <Typography variant="h6" color="error.main">
          {totalExpenses} ₽
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {group.members.length + mockMembers.length} участников · {eventData.expenses.length} трат
        </Typography>
      </Paper>

      {/* Кнопка добавления */}
      <Box sx={{ mb: 2 }}>
        <AddEventExpenseModal
          currentUserId={userId}
          realMembers={realMembers}
          mockMembers={mockMembers}
          memberDisplayNames={memberDisplayNames}
          onAdd={handleAddExpense}
        />
      </Box>

      {/* Фильтр */}
      <Box display="flex" alignItems="center" mb={1}>
        <ToggleButtonGroup
          value={filterMode}
          exclusive
          onChange={(_, val) => { if (val) setFilterMode(val); }}
          size="small"
        >
          <ToggleButton value="all">Все</ToggleButton>
          <ToggleButton value="mine">Мои ({myExpenses.length})</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Список трат */}
      {eventData.expenses.length === 0 ? (
        <Typography color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
          Трат пока нет
        </Typography>
      ) : (
        <List disablePadding>
          {[...eventData.expenses].reverse().map((expense) => {
            const isMyExpense = expense.participantIds.includes(userId);
            const dimmed = filterMode === 'mine' && !isMyExpense;
            const canDelete = userId === expense.addedByTelegramId || isOwner;
            return (
              <EventExpenseItem
                key={expense.id}
                expense={expense}
                realMembers={realMembers}
                mockMembers={mockMembers}
                memberDisplayNames={memberDisplayNames}
                currentUserId={userId}
                canDelete={canDelete}
                dimmed={dimmed}
                onDelete={handleDeleteExpense}
                onToggleTransferred={handleToggleTransferred}
                onUpdate={handleUpdateExpense}
              />
            );
          })}
        </List>
      )}

      {/* Кнопка "Итог" — фиксирована внизу */}
      <Button
        variant="contained"
        size="large"
        startIcon={<CalculateIcon />}
        onClick={() => setSettlementOpen(true)}
        sx={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          px: 4,
          borderRadius: 8
        }}
      >
        Итог
      </Button>

      {/* Диалог итога */}
      <SettlementDialog
        open={settlementOpen}
        onClose={() => setSettlementOpen(false)}
        expenses={eventData.expenses}
        realMembers={realMembers}
        mockMembers={mockMembers}
        memberDisplayNames={memberDisplayNames}
        currentUserId={userId}
        onCloseDebt={handleCloseDebt}
      />

      {/* Настройки */}
      <GroupSettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        group={group}
        currentUserId={userId}
        onRename={handleRename}
        onRemoveMember={handleRemoveMember}
        onLeave={handleLeave}
        onDelete={handleDelete}
        onUpdateMockMembers={handleUpdateMockMembers}
        onUpdateDisplayName={handleUpdateDisplayName}
      />
    </Container>
  );
}
