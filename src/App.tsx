import { Box, Typography } from '@mui/material';
import React, { useState } from 'react';

import { TabsNavigation } from './components/TabsNavigation';
import { useTelegram } from './hooks/use-telegram';
import { LOCAL_USER_ID } from './lib/db';
import { HomePage } from './pages/HomePage';
import { MonthlyExpensesPage } from './pages/MonthlyExpensesPage';
import { APP_VERSION } from './version';

const App: React.FC = () => {
  const [tab, setTab] = useState('home');
  const { user } = useTelegram();

  const userName = user?.first_name ?? 'Гость';
  const userId = user?.id ? String(user.id) : LOCAL_USER_ID;

  return (
    <Box sx={{ py: '84px', minHeight: '100vh', backgroundColor: 'white' }}>
      {tab === 'home' && <HomePage userName={userName} userId={userId} />}
      {tab === 'monthly' && <MonthlyExpensesPage userId={userId} />}
      <TabsNavigation value={tab} onChange={setTab} />
      <Typography
        variant="caption"
        sx={{
          position: 'fixed',
          bottom: '64px',
          right: '8px',
          color: 'text.disabled',
          pointerEvents: 'none',
          userSelect: 'none'
        }}
      >
        v{APP_VERSION}
      </Typography>
    </Box>
  );
};

export default App;
