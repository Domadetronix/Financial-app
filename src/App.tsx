import { Box, Typography } from '@mui/material';
import React, { useState } from 'react';

import { TabsNavigation } from './components/TabsNavigation';
import { useTelegram } from './hooks/use-telegram';
import { HomePage } from './pages/HomePage';
import { MonthlyExpensesPage } from './pages/MonthlyExpensesPage';
import { APP_VERSION } from './version';

const App: React.FC = () => {
  const [tab, setTab] = useState('home');
  const { user } = useTelegram();
  const userName = user?.first_name ?? 'Гость';

  return (
    <Box sx={{ py: '84px', minHeight: '100vh', backgroundColor: 'white' }}>
      {tab === 'home' && <HomePage userName={userName} />}
      {tab === 'monthly' && <MonthlyExpensesPage />}
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
