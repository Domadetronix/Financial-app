import AddIcon from '@mui/icons-material/Add';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import GroupIcon from '@mui/icons-material/Group';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';

import { createGroup, joinGroupByInviteCode, subscribeToUserGroups } from '../lib/groups';
import { Group } from '../types';

interface TelegramUser {
  id: number;
  first_name: string;
  photo_url?: string;
}

interface Props {
  userId: string;
  user: TelegramUser | null;
  onSelectGroup: (groupId: string) => void;
}

export const GroupsPage: React.FC<Props> = ({ userId, user, onSelectGroup }) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    if (userId === 'local') return;
    const unsub = subscribeToUserGroups(userId, setGroups);
    return unsub;
  }, [userId]);

  if (userId === 'local') {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <GroupIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
        <Typography color="text.secondary">Группы доступны только в Telegram</Typography>
      </Box>
    );
  }

  const handleCreate = async () => {
    const name = newGroupName.trim();
    if (!name) return;
    setCreating(true);
    const groupId = await createGroup(
      userId,
      user?.first_name ?? 'Участник',
      name,
      user?.photo_url
    );
    setCreating(false);
    setCreateOpen(false);
    setNewGroupName('');
    onSelectGroup(groupId);
  };

  const handleJoin = async () => {
    const code = inviteCode.trim();
    if (!code) return;
    setJoining(true);
    setJoinError('');
    const result = await joinGroupByInviteCode(code, {
      telegramId: userId,
      name: user?.first_name ?? 'Участник',
      photoUrl: user?.photo_url
    });
    setJoining(false);
    if (result.success && result.groupId) {
      setJoinOpen(false);
      setInviteCode('');
      onSelectGroup(result.groupId);
    } else {
      setJoinError(result.error ?? 'Ошибка');
    }
  };

  return (
    <Container>
      <Typography textAlign="center" variant="h6" mb={2}>
        Группы
      </Typography>

      {groups.length === 0 ? (
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          У вас пока нет групп
        </Typography>
      ) : (
        <List disablePadding sx={{ mb: 2 }}>
          {groups.map((group, idx) => (
            <React.Fragment key={group.id}>
              {idx > 0 && <Divider />}
              <ListItemButton onClick={() => onSelectGroup(group.id)}>
                <ListItemText primary={group.name} secondary={`${group.members.length} уч.`} />
                <ListItemSecondaryAction>
                  <ChevronRightIcon color="action" />
                </ListItemSecondaryAction>
              </ListItemButton>
            </React.Fragment>
          ))}
        </List>
      )}

      <Stack spacing={1}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateOpen(true)}
          fullWidth
        >
          Создать группу
        </Button>
        <Button variant="outlined" onClick={() => setJoinOpen(true)} fullWidth>
          Вступить по коду
        </Button>
      </Stack>

      {/* Диалог создания */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Новая группа</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Название"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            fullWidth
            size="small"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions
          sx={{ flexDirection: 'column', alignItems: 'stretch', gap: 1, px: 3, pb: 2 }}
        >
          <Button
            onClick={handleCreate}
            disabled={!newGroupName.trim() || creating}
            variant="contained"
            fullWidth
          >
            Создать
          </Button>
          <Button onClick={() => setCreateOpen(false)} fullWidth>
            Отмена
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог вступления */}
      <Dialog
        open={joinOpen}
        onClose={() => {
          setJoinOpen(false);
          setJoinError('');
        }}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Вступить по коду</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Код приглашения"
            value={inviteCode}
            onChange={(e) => {
              setInviteCode(e.target.value.toUpperCase());
              setJoinError('');
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
            fullWidth
            size="small"
            sx={{ mt: 1 }}
            slotProps={{ htmlInput: { style: { letterSpacing: 4, fontFamily: 'monospace' } } }}
            error={!!joinError}
            helperText={joinError}
          />
        </DialogContent>
        <DialogActions
          sx={{ flexDirection: 'column', alignItems: 'stretch', gap: 1, px: 3, pb: 2 }}
        >
          <Button
            onClick={handleJoin}
            disabled={!inviteCode.trim() || joining}
            variant="contained"
            fullWidth
          >
            Вступить
          </Button>
          <Button
            onClick={() => {
              setJoinOpen(false);
              setJoinError('');
            }}
            fullWidth
          >
            Отмена
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
