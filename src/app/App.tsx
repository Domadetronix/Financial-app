import { Box, CircularProgress, Dialog, Slide, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import { ThemeSettingsDialog, useThemeSettings } from '@/features/theme-settings';
import { GroupBudgetPage } from '@/pages/group-budget';
import { GroupEventPage } from '@/pages/group-event';
import { GroupsListPage } from '@/pages/groups';
import { HomePage } from '@/pages/home';
import { MonthlyExpensesPage } from '@/pages/monthly';
import { joinGroupByInviteCode, subscribeToGroup } from '@/shared/api';
import { APP_VERSION } from '@/shared/config';
import { useTelegram } from '@/shared/hooks';
import { LOCAL_USER_ID } from '@/shared/lib';
import { Group } from '@/shared/types';
import { TabsNavigation } from '@/widgets/tabs-navigation';

import { AppThemeProvider, NotificationProvider } from './providers';

function AppContent() {
  const [tab, setTab] = useState('home');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7));
  const [joining, setJoining] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);

  const { tg, user } = useTelegram();
  const userName = user?.first_name ?? 'Гость';
  const userId = user?.id ? String(user.id) : LOCAL_USER_ID;

  const { primaryColor, setPrimaryColor } = useThemeSettings(userId);

  // Подписываемся на выбранную группу, чтобы знать её тип
  useEffect(() => {
    if (!selectedGroupId) {
      setSelectedGroup(null);
      return;
    }
    const unsub = subscribeToGroup(selectedGroupId, setSelectedGroup);
    return unsub;
  }, [selectedGroupId]);

  useEffect(() => {
    const startParam = tg?.initDataUnsafe?.start_param;
    if (!startParam || userId === LOCAL_USER_ID) return;

    setJoining(true);
    joinGroupByInviteCode(startParam, {
      telegramId: userId,
      name: user?.first_name ?? 'Участник',
      photoUrl: user?.photo_url
    }).then((result) => {
      setJoining(false);
      if (result.success && result.groupId) {
        setTab('groups');
        setSelectedGroupId(result.groupId);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTabChange = (val: string) => {
    setTab(val);
    if (val !== 'groups') setSelectedGroupId(null);
  };

  const handleCloseGroup = () => setSelectedGroupId(null);

  const groupType = selectedGroup?.type ?? 'budget';
  const groupOpen = Boolean(selectedGroupId);

  return (
    <AppThemeProvider primaryColor={primaryColor}>
      <NotificationProvider>
        {joining ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ pt: '84px', pb: '84px', minHeight: '100vh', backgroundColor: 'white' }}>
            {tab === 'home' && (
              <HomePage
                userName={userName}
                userId={userId}
                currentMonth={currentMonth}
                onMonthChange={setCurrentMonth}
                onThemeClick={() => setThemeOpen(true)}
              />
            )}
            {tab === 'monthly' && <MonthlyExpensesPage userId={userId} />}
            {tab === 'groups' && (
              <GroupsListPage userId={userId} user={user} onSelectGroup={setSelectedGroupId} />
            )}

            {/* Группа как fullscreen попап */}
            <Dialog
              fullScreen
              open={groupOpen}
              TransitionComponent={Slide}
              TransitionProps={{ direction: 'up' } as object}
            >
              <Box sx={{ height: '100%', overflowY: 'auto', backgroundColor: 'background.default' }}>
                {groupType === 'budget' && selectedGroupId && (
                  <GroupBudgetPage
                    groupId={selectedGroupId}
                    userId={userId}
                    onClose={handleCloseGroup}
                  />
                )}
                {groupType === 'event' && selectedGroupId && (
                  <GroupEventPage
                    groupId={selectedGroupId}
                    userId={userId}
                    user={user}
                    onClose={handleCloseGroup}
                  />
                )}
              </Box>
            </Dialog>

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

        <ThemeSettingsDialog
          open={themeOpen}
          currentColor={primaryColor}
          onSelect={(color) => {
            setPrimaryColor(color);
            setThemeOpen(false);
          }}
          onClose={() => setThemeOpen(false)}
        />
      </NotificationProvider>
    </AppThemeProvider>
  );
}

export default AppContent;
