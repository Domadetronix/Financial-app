import { Container, Box } from '@mui/material';
import React, { useState, useEffect } from 'react';

import { EditDialog } from './components/EditDialog';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { Header } from './components/Header';
import { IncomeDialog } from './components/IncomeDialog';
import { Expense, EditData } from './types';
import { loadExpenses, saveExpenses, loadIncome, saveIncome } from './utils/storage';

const App: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [income, setIncome] = useState<number>(0);
  const [editingExpense, setEditingExpense] = useState<EditData | null>(null);
  const [isIncomeDialogOpen, setIncomeDialogOpen] = useState(false);

  useEffect(() => {
    setExpenses(loadExpenses());
    setIncome(loadIncome());
  }, []);

  useEffect(() => {
    saveExpenses(expenses);
    saveIncome(income);
  }, [expenses, income]);

  const addExpense = (expense: Expense) => {
    setExpenses((prev) => [...prev, expense]);
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const updateExpense = (updated: Expense) => {
    setExpenses((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  };

  const handleEditIncome = (newIncome: number) => {
    setIncome(newIncome);
    setIncomeDialogOpen(false);
  };

  const remaining = income - expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <Container sx={{ py: 4, h: '100vh', backgroundColor: 'white' }}>
      <Header
        income={income}
        remaining={remaining}
        onIncomeClick={() => setIncomeDialogOpen(true)}
      />
      <Box sx={{ mt: 3 }}>
        <ExpenseForm onAdd={addExpense} />
        <ExpenseList expenses={expenses} onDelete={deleteExpense} onEdit={setEditingExpense} />
      </Box>

      <EditDialog
        expense={editingExpense}
        onClose={() => setEditingExpense(null)}
        onSave={updateExpense}
      />

      <IncomeDialog
        open={isIncomeDialogOpen}
        onClose={() => setIncomeDialogOpen(false)}
        onSave={handleEditIncome}
        currentIncome={income}
      />
    </Container>
  );
};

export default App;
