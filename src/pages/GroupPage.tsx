import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';

import { EditDialog } from '../components/EditDialog';
import { ExpenseForm } from '../components/ExpenseForm';
import { ExpenseList } from '../components/ExpenseList';
import { GroupHeader } from '../components/GroupHeader';
import { GroupSettingsDialog } from '../components/GroupSettingsDialog';
import { IncomeEntryList } from '../components/IncomeEntryList';
import { MonthlyIncomePickerDialog } from '../components/MonthlyIncomePickerDialog';
import { MonthlyPickerDialog } from '../components/MonthlyPickerDialog';
import { MonthSelector } from '../components/MonthSelector';
import {
  deleteGroup,
  leaveGroup,
  removeMemberFromGroup,
  saveGroupData,
  subscribeToGroup,
  subscribeToGroupData,
  updateGroupName
} from '../lib/groups';
import {
  Expense,
  Group,
  GroupData,
  GroupIncomeEntry,
  GroupMonthExpense,
  IncomeEntry,
  MonthExpense
} from '../types';

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

export const GroupPage: React.FC<Props> = ({ groupId, userId, user, onBack }) => {
  const today = new Date();

  const [group, setGroup] = useState<Group | null>(null);
  const [groupData, setGroupData] = useState<GroupData | null>(null);
  const [currentMonth, setCurrentMonth] = useState<string>(today.toISOString().slice(0, 7));
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editingIncome, setEditingIncome] = useState<IncomeEntry | null>(null);
  const [monthSelectorOpen, setMonthSelectorOpen] = useState(false);
  const [monthlyExpensePickerOpen, setMonthlyExpensePickerOpen] = useState(false);
  const [monthlyIncomePickerOpen, setMonthlyIncomePickerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [incomeName, setIncomeName] = useState('');
  const [incomeAmount, setIncomeAmount] = useState('');

  useEffect(() => {
    const unsubGroup = subscribeToGroup(groupId, setGroup);
    const unsubData = subscribeToGroupData(groupId, data => {
      setGroupData(
        data ?? {
          incomeEntriesByMonth: {},
          expensesByMonth: {},
          monthlyIncomes: [],
          monthlyExpenses: []
        }
      );
    });
    return () => {
      unsubGroup();
      unsubData();
    };
  }, [groupId]);

  if (!group || !groupData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  // ── Доходы ──────────────────────────────────────────────────────────────

  const handleAddIncome = () => {
    const parsed = parseFloat(incomeAmount);
    if (!incomeName || isNaN(parsed) || parsed < 0) return;
    const entry: GroupIncomeEntry = { id: uuid(), name: incomeName, amount: parsed, addedByTelegramId: userId };
    const updated = {
      ...groupData.incomeEntriesByMonth,
      [currentMonth]: [...(groupData.incomeEntriesByMonth[currentMonth] || []), entry]
    };
    saveGroupData(groupId, 'incomeEntriesByMonth', updated);
    setIncomeName('');
    setIncomeAmount('');
  };

  const handleDeleteIncome = (id: string) => {
    const updated = {
      ...groupData.incomeEntriesByMonth,
      [currentMonth]: (groupData.incomeEntriesByMonth[currentMonth] || []).filter(e => e.id !== id)
    };
    saveGroupData(groupId, 'incomeEntriesByMonth', updated);
  };

  const handleSaveIncomeEdit = (edited: IncomeEntry) => {
    const updated = {
      ...groupData.incomeEntriesByMonth,
      [currentMonth]: (groupData.incomeEntriesByMonth[currentMonth] || []).map(e =>
        e.id === edited.id ? { ...e, ...edited } : e
      )
    };
    saveGroupData(groupId, 'incomeEntriesByMonth', updated);
    setEditingIncome(null);
  };

  const handleAddFromMonthlyIncomes = (entries: IncomeEntry[]) => {
    const tagged: GroupIncomeEntry[] = entries.map(e => ({ ...e, addedByTelegramId: userId }));
    const updated = {
      ...groupData.incomeEntriesByMonth,
      [currentMonth]: [...(groupData.incomeEntriesByMonth[currentMonth] || []), ...tagged]
    };
    saveGroupData(groupId, 'incomeEntriesByMonth', updated);
  };

  // ── Траты ───────────────────────────────────────────────────────────────

  const handleAddExpense = (expense: Expense) => {
    const monthExpense: GroupMonthExpense = { ...expense, closed: false, addedByTelegramId: userId };
    const updated = {
      ...groupData.expensesByMonth,
      [currentMonth]: [...(groupData.expensesByMonth[currentMonth] || []), monthExpense]
    };
    saveGroupData(groupId, 'expensesByMonth', updated);
  };

  const handleAddFromMonthlyExpenses = (expenses: MonthExpense[]) => {
    const tagged: GroupMonthExpense[] = expenses.map(e => ({ ...e, addedByTelegramId: userId }));
    const updated = {
      ...groupData.expensesByMonth,
      [currentMonth]: [...(groupData.expensesByMonth[currentMonth] || []), ...tagged]
    };
    saveGroupData(groupId, 'expensesByMonth', updated);
  };

  const handleDeleteExpense = (id: string) => {
    const updated = {
      ...groupData.expensesByMonth,
      [currentMonth]: (groupData.expensesByMonth[currentMonth] || []).filter(e => e.id !== id)
    };
    saveGroupData(groupId, 'expensesByMonth', updated);
  };

  const handleSaveExpenseEdit = (edited: Expense) => {
    const updated = {
      ...groupData.expensesByMonth,
      [currentMonth]: (groupData.expensesByMonth[currentMonth] || []).map(e =>
        e.id === edited.id ? { ...e, ...edited } : e
      )
    };
    saveGroupData(groupId, 'expensesByMonth', updated);
    setEditingExpense(null);
  };

  const handleToggleClose = (id: string) => {
    const updated = {
      ...groupData.expensesByMonth,
      [currentMonth]: (groupData.expensesByMonth[currentMonth] || []).map(e =>
        e.id === id ? { ...e, closed: !e.closed } : e
      )
    };
    saveGroupData(groupId, 'expensesByMonth', updated);
  };

  // ── Настройки группы ────────────────────────────────────────────────────

  const handleRename = (name: string) => {
    updateGroupName(groupId, name);
  };

  const handleRemoveMember = (telegramId: string) => {
    removeMemberFromGroup(groupId, telegramId);
  };

  const handleLeave = async () => {
    await leaveGroup(groupId, userId);
    onBack();
  };

  const handleDelete = async () => {
    await deleteGroup(groupId);
    onBack();
  };

  // ── Расчёт ──────────────────────────────────────────────────────────────

  const currentIncomeEntries = groupData.incomeEntriesByMonth[currentMonth] || [];
  const currentMonthExpenses = groupData.expensesByMonth[currentMonth] || [];
  const totalIncome = currentIncomeEntries.reduce((sum, e) => sum + e.amount, 0);
  const totalExpenses = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = totalIncome - totalExpenses;

  return (
    <Container>
      <GroupHeader
        groupName={group.name}
        remaining={remaining}
        currentMonth={currentMonth}
        onMonthClick={() => setMonthSelectorOpen(true)}
        onBack={onBack}
        onSettings={() => setSettingsOpen(true)}
      />

      {/* Аккордеон: Доходы */}
      <Accordion defaultExpanded disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1" fontWeight={600}>
            Доходы
          </Typography>
          <Typography variant="subtitle1" color="success.main" sx={{ ml: 'auto', mr: 1 }}>
            {totalIncome} ₽
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0 }}>
          <Box display="flex" gap={1} mb={1}>
            <TextField
              label="Название"
              value={incomeName}
              onChange={e => setIncomeName(e.target.value)}
              size="small"
              fullWidth
            />
            <TextField
              label="Сумма"
              value={incomeAmount}
              onChange={e => setIncomeAmount(e.target.value)}
              slotProps={{ htmlInput: { inputMode: 'decimal' } }}
              size="small"
              sx={{ width: 120 }}
            />
          </Box>
          <Button variant="contained" fullWidth onClick={handleAddIncome} sx={{ mb: 1 }}>
            Добавить
          </Button>
          <Button variant="outlined" fullWidth onClick={() => setMonthlyIncomePickerOpen(true)} sx={{ mb: 1 }}>
            + Из регулярных
          </Button>
          <IncomeEntryList
            entries={currentIncomeEntries}
            onDelete={handleDeleteIncome}
            onEdit={setEditingIncome}
          />
        </AccordionDetails>
      </Accordion>

      {/* Аккордеон: Траты */}
      <Accordion defaultExpanded disableGutters sx={{ mt: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1" fontWeight={600}>
            Траты
          </Typography>
          <Typography variant="subtitle1" color="error.main" sx={{ ml: 'auto', mr: 1 }}>
            {totalExpenses} ₽
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0 }}>
          <ExpenseForm onAdd={handleAddExpense} />
          <Button
            variant="outlined"
            fullWidth
            sx={{ mt: 1, mb: 1 }}
            onClick={() => setMonthlyExpensePickerOpen(true)}
          >
            + Из регулярных
          </Button>
          <ExpenseList
            expenses={currentMonthExpenses}
            onDelete={handleDeleteExpense}
            onEdit={setEditingExpense}
            onClose={handleToggleClose}
          />
        </AccordionDetails>
      </Accordion>

      <MonthSelector
        open={monthSelectorOpen}
        onClose={() => setMonthSelectorOpen(false)}
        selected={currentMonth}
        onSelect={m => {
          setCurrentMonth(m);
          setMonthSelectorOpen(false);
        }}
      />

      <MonthlyPickerDialog
        open={monthlyExpensePickerOpen}
        onClose={() => setMonthlyExpensePickerOpen(false)}
        monthlyExpenses={groupData.monthlyExpenses}
        onAdd={handleAddFromMonthlyExpenses}
      />

      <MonthlyIncomePickerDialog
        open={monthlyIncomePickerOpen}
        onClose={() => setMonthlyIncomePickerOpen(false)}
        monthlyIncomes={groupData.monthlyIncomes}
        onAdd={handleAddFromMonthlyIncomes}
      />

      {editingExpense && (
        <EditDialog
          expense={editingExpense}
          onClose={() => setEditingExpense(null)}
          onSave={handleSaveExpenseEdit}
        />
      )}

      {editingIncome && (
        <EditDialog
          expense={editingIncome}
          onClose={() => setEditingIncome(null)}
          onSave={handleSaveIncomeEdit}
        />
      )}

      <GroupSettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        group={group}
        currentUserId={userId}
        onRename={handleRename}
        onRemoveMember={handleRemoveMember}
        onLeave={handleLeave}
        onDelete={handleDelete}
      />
    </Container>
  );
};
