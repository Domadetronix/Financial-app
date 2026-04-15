import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SettingsIcon from '@mui/icons-material/Settings';
import { Button, IconButton, Paper, Typography } from '@mui/material';
import React from 'react';

interface Props {
  groupName: string;
  remaining: number;
  currentMonth: string;
  onMonthClick: () => void;
  onBack: () => void;
  onSettings: () => void;
}

const MONTHS_RU = [
  'Январь','Февраль','Март','Апрель','Май','Июнь',
  'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'
];

const formatMonth = (ym: string): string => {
  const [year, month] = ym.split('-').map(Number);
  return `${MONTHS_RU[month - 1]} ${year}`;
};

export const GroupHeader: React.FC<Props> = ({
  groupName,
  remaining,
  currentMonth,
  onMonthClick,
  onBack,
  onSettings
}) => {
  return (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0.5,
        mb: 3,
        position: 'relative'
      }}
    >
      <IconButton
        size="small"
        onClick={onBack}
        sx={{ position: 'absolute', top: 8, left: 8 }}
      >
        <ArrowBackIcon />
      </IconButton>
      <IconButton
        size="small"
        onClick={onSettings}
        sx={{ position: 'absolute', top: 8, right: 8 }}
      >
        <SettingsIcon />
      </IconButton>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        {groupName}
      </Typography>
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
