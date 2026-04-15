import { Box } from '@mui/material';
import React, { useState } from 'react';

import { TabsNavigation } from './components/TabsNavigation';
import { useTelegram } from './hooks/use-telegram';
import { HomePage } from './pages/HomePage';
import { MonthlyExpensesPage } from './pages/MonthlyExpensesPage';

const App: React.FC = () => {
  const [tab, setTab] = useState('home');
  const { user } = useTelegram();
  const userName = user?.first_name ?? 'Гость';

  return (
    <Box sx={{ pt: '84px', minHeight: '100vh', backgroundColor: 'white' }}>
      {tab === 'home' && <HomePage userName={userName} />}
      {tab === 'monthly' && <MonthlyExpensesPage />}
      <TabsNavigation value={tab} onChange={setTab} />
    </Box>
  );
};

export default App;
