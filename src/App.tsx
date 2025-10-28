import { Box } from '@mui/material';
import React, { useState } from 'react';

import { TabsNavigation } from './components/TabsNavigation';
import { HomePage } from './pages/HomePage';
import { MonthlyExpensesPage } from './pages/MonthlyExpensesPage';
// import { StatisticsPage } from './pages/StatisticsPage';

const App: React.FC = () => {
  const [tab, setTab] = useState('home');
  return (
    <Box sx={{ mt: '84px', height: '100vh', backgroundColor: 'white' }}>
      {tab === 'home' && <HomePage />}
      {tab === 'monthly' && <MonthlyExpensesPage />}
      {/* {tab === 'stats' && <StatisticsPage />} */}
      <TabsNavigation value={tab} onChange={setTab} />
    </Box>
  );
};

export default App;
