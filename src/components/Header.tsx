import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { Button, Paper, Typography } from '@mui/material';
import React from 'react';

interface Props {
  remaining: number;
  currentMonth: string;
  onMonthClick: () => void;
  userName?: string;
}

const MONTHS_RU = [
  'Январь','Февраль','Март','Апрель','Май','Июнь',
  'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'
];

const formatMonth = (ym: string): string => {
  const [year, month] = ym.split('-').map(Number);
  return `${MONTHS_RU[month - 1]} ${year}`;
};

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
      <Button
        variant="outlined"
        size="small"
        startIcon={<CalendarMonthIcon />}
        onClick={onMonthClick}
        sx={{ textTransform: 'none', fontWeight: 500 }}
      >
        {formatMonth(currentMonth)}
      </Button>
    </Paper>
  );
};
