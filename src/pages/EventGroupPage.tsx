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
import React, { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';

import { EventExpenseForm } from '../components/EventExpenseForm';
import { EventExpenseItem } from '../components/EventExpenseItem';
import { GroupSettingsDialog } from '../components/GroupSettingsDialog';
import { SettlementDialog } from '../components/SettlementDialog';
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
} from '../lib/groups';
import { EventGroupData, Group, GroupEventExpense, MockMember } from '../types';

interface TelegramUser {
  id: number;
  first_name: string;
  photo_url?: string;
}

interface Props {
  groupId: string;
  userId: string;
  user: TelegramUser | null;
  onBack: () => void;
}

type FilterMode = 'mine' | 'all';

export const EventGroupPage: React.FC<Props> = ({ groupId, userId, onBack }) => {
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

  // ── Траты ───────────────────────────────────────────────────────────────────

  const handleAddExpense = (partial: Omit<GroupEventExpense, 'id' | 'createdAt'>) => {
    const expense: GroupEventExpense = {
      ...partial,
      id: uuid(),
      createdAt: new Date().toISOString()
    };
    const updated = [...eventData.expenses, expense];
    saveEventGroupData(groupId, 'expenses', updated);
  };

  const handleDeleteExpense = (id: string) => {
    const updated = eventData.expenses.filter((e) => e.id !== id);
    saveEventGroupData(groupId, 'expenses', updated);
  };

  // ── Расчёт ──────────────────────────────────────────────────────────────────

  const handleTogglePaid = (fromId: string, toId: string, paid: boolean) => {
    const key = `${fromId}_${toId}`;
    const updated = { ...eventData.settlementPaid, [key]: paid };
    saveEventGroupData(groupId, 'settlementPaid', updated);
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
    onBack();
  };

  const handleDelete = async () => {
    await deleteGroup(groupId);
    onBack();
  };

  // ── Фильтрация ──────────────────────────────────────────────────────────────

  const myExpenses = eventData.expenses.filter((e) => e.participantIds.includes(userId));
  const totalExpenses = eventData.expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <Container>
      {/* Шапка */}
      <Paper sx={{ p: 2, mb: 2, position: 'relative', textAlign: 'center' }}>
        <IconButton size="small" onClick={onBack} sx={{ position: 'absolute', top: 8, left: 8 }}>
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

      {/* Форма добавления */}
      <Box sx={{ mb: 2 }}>
        <EventExpenseForm
          currentUserId={userId}
          realMembers={realMembers}
          mockMembers={mockMembers}
          memberDisplayNames={memberDisplayNames}
          onAdd={handleAddExpense}
        />
      </Box>

      {/* Фильтр + кнопка итога */}
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <ToggleButtonGroup
          value={filterMode}
          exclusive
          onChange={(_, val) => {
            if (val) setFilterMode(val);
          }}
          size="small"
        >
          <ToggleButton value="all">Все</ToggleButton>
          <ToggleButton value="mine">Мои ({myExpenses.length})</ToggleButton>
        </ToggleButtonGroup>
        <Button
          variant="outlined"
          size="small"
          startIcon={<CalculateIcon />}
          onClick={() => setSettlementOpen(true)}
          sx={{ ml: 'auto' }}
        >
          Итог
        </Button>
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
            return (
              <EventExpenseItem
                key={expense.id}
                expense={expense}
                realMembers={realMembers}
                mockMembers={mockMembers}
                memberDisplayNames={memberDisplayNames}
                currentUserId={userId}
                dimmed={dimmed}
                onDelete={handleDeleteExpense}
              />
            );
          })}
        </List>
      )}

      {/* Диалог итога */}
      <SettlementDialog
        open={settlementOpen}
        onClose={() => setSettlementOpen(false)}
        expenses={eventData.expenses}
        realMembers={realMembers}
        mockMembers={mockMembers}
        memberDisplayNames={memberDisplayNames}
        settlementPaid={eventData.settlementPaid}
        onTogglePaid={handleTogglePaid}
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
};
