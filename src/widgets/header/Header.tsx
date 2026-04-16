import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SettingsIcon from '@mui/icons-material/Settings';
import { Button, IconButton, Paper, Typography } from '@mui/material';

interface Props {
  remaining: number;
  currentMonth: string;
  onMonthClick: () => void;
  onThemeClick: () => void;
  userName?: string;
}

const MONTHS_RU = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

const formatMonth = (ym: string): string => {
  const [year, month] = ym.split('-').map(Number);
  return `${MONTHS_RU[month - 1]} ${year}`;
};

export function Header({ remaining, currentMonth, onMonthClick, onThemeClick, userName }: Props) {
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
        onClick={onThemeClick}
        sx={{ position: 'absolute', top: 8, right: 8 }}
      >
        <SettingsIcon fontSize="small" />
      </IconButton>
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
}
