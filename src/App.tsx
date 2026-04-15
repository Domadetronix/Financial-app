import { Box, Typography } from '@mui/material';
import React, { useState } from 'react';

import { TabsNavigation } from './components/TabsNavigation';
import { useTelegram } from './hooks/use-telegram';
import { LOCAL_USER_ID } from './lib/db';
import { GroupPage } from './pages/GroupPage';
import { GroupsPage } from './pages/GroupsPage';
import { HomePage } from './pages/HomePage';
import { MonthlyExpensesPage } from './pages/MonthlyExpensesPage';
import { APP_VERSION } from './version';

const App: React.FC = () => {
  const [tab, setTab] = useState('home');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const { user } = useTelegram();

  const userName = user?.first_name ?? 'Гость';
  const userId = user?.id ? String(user.id) : LOCAL_USER_ID;

  const handleTabChange = (val: string) => {
    setTab(val);
    if (val !== 'groups') setSelectedGroupId(null);
  };

  return (
    <Box sx={{ py: '84px', minHeight: '100vh', backgroundColor: 'white' }}>
      {tab === 'home' && <HomePage userName={userName} userId={userId} />}
      {tab === 'monthly' && <MonthlyExpensesPage userId={userId} />}
      {tab === 'groups' && !selectedGroupId && (
        <GroupsPage userId={userId} user={user} onSelectGroup={setSelectedGroupId} />
      )}
      {tab === 'groups' && selectedGroupId && (
        <GroupPage
          groupId={selectedGroupId}
          userId={userId}
          user={user}
          onBack={() => setSelectedGroupId(null)}
        />
      )}
      <TabsNavigation value={tab} onChange={handleTabChange} />
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
