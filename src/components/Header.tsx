import { Box, Paper, Typography } from '@mui/material';
import React from 'react';

interface Props {
  income: number;
  remaining: number;
  currentMonth: string;
  onMonthClick: () => void;
  onIncomeClick: () => void;
}

export const Header: React.FC<Props> = ({
  income,
  remaining,
  currentMonth,
  onMonthClick,
  onIncomeClick
}) => (
  <Paper
    sx={{
      p: 2,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      mb: 3
    }}
  >
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <Typography variant="h6" color="primary" onClick={onIncomeClick} sx={{ cursor: 'pointer' }}>
        {income} ₽
      </Typography>

      <Typography variant="h6" color={remaining >= 0 ? 'success.main' : 'error.main'}>
        {remaining} ₽
      </Typography>
    </Box>
    <Typography variant="h6" onClick={onMonthClick} sx={{ cursor: 'pointer' }}>
      {currentMonth}
    </Typography>
  </Paper>
);
