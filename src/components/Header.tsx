import { Paper, Typography } from '@mui/material';
import React from 'react';

interface Props {
  remaining: number;
  currentMonth: string;
  onMonthClick: () => void;
  userName?: string;
}

export const Header: React.FC<Props> = ({ remaining, currentMonth, onMonthClick, userName }) => {
  return (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0.5,
        mb: 3
      }}
    >
      {userName && (
        <Typography variant="body2" color="text.secondary">
          Привет, {userName}!
        </Typography>
      )}
      <Typography variant="h6" color={remaining >= 0 ? 'success.main' : 'error.main'}>
        {remaining} ₽
      </Typography>
      <Typography variant="h6" onClick={onMonthClick} sx={{ cursor: 'pointer' }}>
        {currentMonth}
      </Typography>
    </Paper>
  );
};
