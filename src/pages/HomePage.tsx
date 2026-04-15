import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  TextField,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';

import { EditDialog } from '../components/EditDialog';
import { ExpenseForm } from '../components/ExpenseForm';
import { ExpenseList } from '../components/ExpenseList';
import { Header } from '../components/Header';
import { IncomeEntryList } from '../components/IncomeEntryList';
import { MonthlyIncomePickerDialog } from '../components/MonthlyIncomePickerDialog';
import { MonthlyPickerDialog } from '../components/MonthlyPickerDialog';
import { MonthSelector } from '../components/MonthSelector';
import { Expense, IncomeEntry, MonthExpense } from '../types';
import {
  loadExpenses,
  loadIncomeEntries,
  loadMonthlyExpenses,
  loadMonthlyIncomes,
  saveExpenses,
  saveIncomeEntries,
  saveMonthlyIncomes
} from '../utils/storage';

interface Props {
  userName: string;
}

export const HomePage: React.FC<Props> = ({ userName }) => {
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState<string>(today.toISOString().slice(0, 7));
  const [incomeEntriesByMonth, setIncomeEntriesByMonth] = useState<Record<string, IncomeEntry[]>>(
    {}
  );
  const [expensesByMonth, setExpensesByMonth] = useState<Record<string, MonthExpense[]>>({});
  const [monthlyExpenses, setMonthlyExpenses] = useState<Expense[]>([]);
  const [monthlyIncomes, setMonthlyIncomes] = useState<IncomeEntry[]>([]);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editingIncome, setEditingIncome] = useState<IncomeEntry | null>(null);
  const [monthSelectorOpen, setMonthSelectorOpen] = useState(false);
  const [monthlyExpensePickerOpen, setMonthlyExpensePickerOpen] = useState(false);
  const [monthlyIncomePickerOpen, setMonthlyIncomePickerOpen] = useState(false);
  const [incomeName, setIncomeName] = useState('');
  const [incomeAmount, setIncomeAmount] = useState<number | ''>('');

  useEffect(() => {
    setIncomeEntriesByMonth(loadIncomeEntries());
    setExpensesByMonth(loadExpenses());
    setMonthlyExpenses(loadMonthlyExpenses());
    setMonthlyIncomes(loadMonthlyIncomes());
  }, []);

  // ── Доходы ──────────────────────────────────────────────────────────────

  const handleAddIncome = () => {
    if (!incomeName || incomeAmount === '') return;
    const entry: IncomeEntry = { id: uuid(), name: incomeName, amount: Number(incomeAmount) };
    setIncomeEntriesByMonth((prev) => {
      const updated = { ...prev, [currentMonth]: [...(prev[currentMonth] || []), entry] };
      saveIncomeEntries(updated);
      return updated;
    });
    setIncomeName('');
    setIncomeAmount('');
  };

  const handleDeleteIncome = (id: string) => {
    setIncomeEntriesByMonth((prev) => {
      const updated = {
        ...prev,
        [currentMonth]: (prev[currentMonth] || []).filter((e) => e.id !== id)
      };
      saveIncomeEntries(updated);
      return updated;
    });
  };

  const handleSaveIncomeEdit = (updated: IncomeEntry) => {
    setIncomeEntriesByMonth((prev) => {
      const updatedList = (prev[currentMonth] || []).map((e) =>
        e.id === updated.id ? updated : e
      );
      const updatedData = { ...prev, [currentMonth]: updatedList };
      saveIncomeEntries(updatedData);
      return updatedData;
    });
    setEditingIncome(null);
  };

  const handleAddFromMonthlyIncomes = (entries: IncomeEntry[]) => {
    setIncomeEntriesByMonth((prev) => {
      const updated = { ...prev, [currentMonth]: [...(prev[currentMonth] || []), ...entries] };
      saveIncomeEntries(updated);
      return updated;
    });
  };

  // ── Траты ───────────────────────────────────────────────────────────────

  const handleAddExpense = (expense: Expense) => {
    const monthExpense: MonthExpense = { ...expense, closed: false };
    setExpensesByMonth((prev) => {
      const updated = { ...prev, [currentMonth]: [...(prev[currentMonth] || []), monthExpense] };
      saveExpenses(updated);
      return updated;
    });
  };

  const handleAddFromMonthlyExpenses = (expenses: MonthExpense[]) => {
    setExpensesByMonth((prev) => {
      const updated = { ...prev, [currentMonth]: [...(prev[currentMonth] || []), ...expenses] };
      saveExpenses(updated);
      return updated;
    });
  };

  const handleDeleteExpense = (id: string) => {
    setExpensesByMonth((prev) => {
      const updated = {
        ...prev,
        [currentMonth]: (prev[currentMonth] || []).filter((e) => e.id !== id)
      };
      saveExpenses(updated);
      return updated;
    });
  };

  const handleSaveExpenseEdit = (updated: Expense) => {
    setExpensesByMonth((prev) => {
      const updatedList = (prev[currentMonth] || []).map((e) =>
        e.id === updated.id ? { ...updated, closed: e.closed } : e
      );
      const updatedData = { ...prev, [currentMonth]: updatedList };
      saveExpenses(updatedData);
      return updatedData;
    });
  };

  const handleToggleClose = (id: string) => {
    setExpensesByMonth((prev) => {
      const updatedList = (prev[currentMonth] || []).map((e) =>
        e.id === id ? { ...e, closed: !e.closed } : e
      );
      const updated = { ...prev, [currentMonth]: updatedList };
      saveExpenses(updated);
      return updated;
    });
  };

  // ── Месяц ───────────────────────────────────────────────────────────────

  const generateFiveMonths = (): string[] => {
    const months: string[] = [];
    for (let i = -1; i <= 4; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() + i, 1);
      months.push(date.toISOString().slice(0, 7));
    }
    return months;
  };

  // ── Расчёт ──────────────────────────────────────────────────────────────

  const currentIncomeEntries = incomeEntriesByMonth[currentMonth] || [];
  const currentMonthExpenses = expensesByMonth[currentMonth] || [];
  const totalIncome = currentIncomeEntries.reduce((sum, e) => sum + e.amount, 0);
  const totalExpenses = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = totalIncome - totalExpenses;

  return (
    <Container>
      <Header
        remaining={remaining}
        currentMonth={currentMonth}
        onMonthClick={() => setMonthSelectorOpen(true)}
        userName={userName}
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
              label="Источник"
              value={incomeName}
              onChange={(e) => setIncomeName(e.target.value)}
              size="small"
              fullWidth
            />
            <TextField
              label="Сумма"
              type="number"
              value={incomeAmount}
              onChange={(e) =>
                setIncomeAmount(e.target.value === '' ? '' : Number(e.target.value))
              }
              size="small"
              sx={{ width: 120 }}
            />
          </Box>
          <Box display="flex" gap={1} mb={1}>
            <Button variant="contained" fullWidth onClick={handleAddIncome}>
              Добавить
            </Button>
            <Button variant="outlined" fullWidth onClick={() => setMonthlyIncomePickerOpen(true)}>
              + Из регулярных
            </Button>
          </Box>
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
        months={generateFiveMonths()}
        selected={currentMonth}
        onSelect={(m) => {
          setCurrentMonth(m);
          setMonthSelectorOpen(false);
        }}
      />

      <MonthlyPickerDialog
        open={monthlyExpensePickerOpen}
        onClose={() => setMonthlyExpensePickerOpen(false)}
        monthlyExpenses={monthlyExpenses}
        onAdd={handleAddFromMonthlyExpenses}
      />

      <MonthlyIncomePickerDialog
        open={monthlyIncomePickerOpen}
        onClose={() => setMonthlyIncomePickerOpen(false)}
        monthlyIncomes={monthlyIncomes}
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
    </Container>
  );
};
