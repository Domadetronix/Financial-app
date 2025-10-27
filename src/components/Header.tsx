import { Typography, Paper } from '@mui/material';
import React from 'react';

interface HeaderProps {
  income: number;
  remaining: number;
  onIncomeClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ income, remaining, onIncomeClick }) => {
  const month = new Date().toLocaleString('ru', { month: 'long' });

  return (
    <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h6" color="primary" onClick={onIncomeClick} sx={{ cursor: 'pointer' }}>
        {income} ₽
      </Typography>
      <Typography variant="h6">{month}</Typography>
      <Typography variant="h6" color={remaining >= 0 ? 'success.main' : 'error.main'}>
        {remaining} ₽
      </Typography>
    </Paper>
  );
};
