import { Box, CircularProgress, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

import { TabsNavigation } from './components/TabsNavigation';
import { NotificationProvider } from './contexts/NotificationContext';
import { useTelegram } from './hooks/use-telegram';
import { LOCAL_USER_ID } from './lib/db';
import { joinGroupByInviteCode } from './lib/groups';
import { GroupPage } from './pages/GroupPage';
import { GroupsPage } from './pages/GroupsPage';
import { HomePage } from './pages/HomePage';
import { MonthlyExpensesPage } from './pages/MonthlyExpensesPage';
import { APP_VERSION } from './version';

const App: React.FC = () => {
  const [tab, setTab] = useState('home');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7));
  const [joining, setJoining] = useState(false);
  const { tg, user } = useTelegram();

  const userName = user?.first_name ?? 'Гость';
  const userId = user?.id ? String(user.id) : LOCAL_USER_ID;

  useEffect(() => {
    const startParam = tg?.initDataUnsafe?.start_param;
    if (!startParam || userId === LOCAL_USER_ID) return;

    setJoining(true);
    joinGroupByInviteCode(startParam, {
      telegramId: userId,
      name: user?.first_name ?? 'Участник',
      photoUrl: user?.photo_url
    }).then(result => {
      setJoining(false);
      if (result.success && result.groupId) {
        setTab('groups');
        setSelectedGroupId(result.groupId);
      }
    });
  }, []);

  const handleTabChange = (val: string) => {
    setTab(val);
    if (val !== 'groups') setSelectedGroupId(null);
  };

  return (
    <NotificationProvider>
      {joining ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ pt: '84px', pb: '84px', minHeight: '100vh', backgroundColor: 'white' }}>
          {tab === 'home' && <HomePage userName={userName} userId={userId} currentMonth={currentMonth} onMonthChange={setCurrentMonth} />}
          {tab === 'monthly' && <MonthlyExpensesPage userId={userId} />}
          {tab === 'groups' && !selectedGroupId && (
            <GroupsPage userId={userId} user={user} onSelectGroup={setSelectedGroupId} />
          )}
          {tab === 'groups' && selectedGroupId && (
            <GroupPage
              groupId={selectedGroupId}
              userId={userId}
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
      )}
    </NotificationProvider>
  );
};

export default App;
