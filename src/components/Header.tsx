import { Box, Paper, Typography } from '@mui/material';
import React from 'react';

interface Props {
  income: number;
  remaining: number;
  currentMonth: string;
  onMonthClick: () => void;
  onIncomeClick: () => void;
  userName?: string;
}

type TgDebugInfo =
  | { connected: false }
  | { connected: true; version: string; platform: string; hasInitData: boolean; user: object | null };

const getTelegramDebugInfo = (): TgDebugInfo => {
  const tg = window?.Telegram?.WebApp;
  if (!tg) return { connected: false };
  return {
    connected: true,
    version: tg.version ?? '?',
    platform: tg.platform ?? '?',
    hasInitData: Boolean(tg.initData),
    user: tg.initDataUnsafe?.user ?? null
  };
};

export const Header: React.FC<Props> = ({
  income,
  remaining,
  currentMonth,
  onMonthClick,
  onIncomeClick,
  userName
}) => {
  const debug = getTelegramDebugInfo();

  return (
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
      {userName && (
        <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center', mb: 1 }}>
          Привет, {userName}!
        </Typography>
      )}
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

      {/* DEBUG — удалить после диагностики */}
      <Box
        sx={{
          mt: 1,
          p: 1,
          width: '100%',
          backgroundColor: '#f5f5f5',
          borderRadius: 1,
          fontSize: '10px',
          fontFamily: 'monospace',
          wordBreak: 'break-all'
        }}
      >
        <div>tg: {debug.connected ? '✅' : '❌ не подключён'}</div>
        {debug.connected && (
          <>
            <div>ver: {debug.version} | platform: {debug.platform}</div>
            <div>initData: {debug.hasInitData ? '✅' : '❌ пусто'}</div>
            <div>user: {debug.user ? JSON.stringify(debug.user) : '❌ null'}</div>
          </>
        )}
      </Box>
    </Paper>
  );
};
