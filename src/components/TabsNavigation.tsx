import BarChartIcon from '@mui/icons-material/BarChart';
import HomeIcon from '@mui/icons-material/Home';
import RepeatIcon from '@mui/icons-material/Repeat';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import React from 'react';

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export const TabsNavigation: React.FC<Props> = ({ value, onChange }) => {
  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, pb: '32px' }} elevation={3}>
      <BottomNavigation value={value} onChange={(_, newValue) => onChange(newValue)} showLabels>
        <BottomNavigationAction label="Главная" value="home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Ежемесячные" value="monthly" icon={<RepeatIcon />} />
        <BottomNavigationAction disabled label="Статистика" value="stats" icon={<BarChartIcon />} />
      </BottomNavigation>
    </Paper>
  );
};
