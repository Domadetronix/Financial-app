import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ShareIcon from '@mui/icons-material/Share';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';

import { Group, MockMember } from '@/shared/types';
import { ConfirmDialog } from '@/shared/ui';

interface Props {
  open: boolean;
  onClose: () => void;
  group: Group;
  currentUserId: string;
  onRename: (name: string) => void;
  onRemoveMember: (telegramId: string) => void;
  onLeave: () => void;
  onDelete: () => void;
  onUpdateMockMembers?: (mocks: MockMember[]) => void;
  onUpdateDisplayName?: (memberId: string, name: string) => void;
}

export function GroupSettingsDialog({
  open,
  onClose,
  group,
  currentUserId,
  onRename,
  onRemoveMember,
  onLeave,
  onDelete,
  onUpdateMockMembers,
  onUpdateDisplayName
}: Props) {
  const [name, setName] = useState(group.name);
  const [copied, setCopied] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [leaveConfirmOpen, setLeaveConfirmOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);
  const [newMockName, setNewMockName] = useState('');
  const [editingDisplayName, setEditingDisplayName] = useState<string | null>(null);
  const [displayNameValue, setDisplayNameValue] = useState('');

  const isOwner = group.ownerTelegramId === currentUserId;
  const mockMembers = group.mockMembers ?? [];
  const memberDisplayNames = group.memberDisplayNames ?? {};

  useEffect(() => {
    setName(group.name);
  }, [group.name]);

  const handleRename = () => {
    const trimmed = name.trim();
    if (trimmed && trimmed !== group.name) onRename(trimmed);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(group.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    const deepLink = `https://t.me/domadetronix_financial_bot?startapp=${group.inviteCode}`;
    const text = `Присоединяйся к группе «${group.name}»!`;
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(deepLink)}&text=${encodeURIComponent(text)}`;
    window.Telegram?.WebApp?.openTelegramLink(shareUrl);
  };

  const handleAddMockMember = () => {
    const trimmed = newMockName.trim();
    if (!trimmed || !onUpdateMockMembers) return;
    const newMock: MockMember = { id: uuid(), name: trimmed };
    onUpdateMockMembers([...mockMembers, newMock]);
    setNewMockName('');
  };

  const handleRemoveMockMember = (id: string) => {
    if (!onUpdateMockMembers) return;
    onUpdateMockMembers(mockMembers.filter(m => m.id !== id));
  };

  const startEditDisplayName = (memberId: string) => {
    setEditingDisplayName(memberId);
    setDisplayNameValue(memberDisplayNames[memberId] ?? '');
  };

  const saveDisplayName = () => {
    if (!editingDisplayName || !onUpdateDisplayName) return;
    onUpdateDisplayName(editingDisplayName, displayNameValue.trim());
    setEditingDisplayName(null);
    setDisplayNameValue('');
  };

  const getMemberDisplayName = (telegramId: string, fallback: string) =>
    memberDisplayNames[telegramId] ?? fallback;

  const memberToRemoveObj = memberToRemove
    ? group.members.find(m => m.telegramId === memberToRemove)
    : null;

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
        <DialogTitle>Настройки группы</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            sx={{ mt: 1.5 }}
            label="Название группы"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleRename}
            size="small"
            fullWidth
          />

          <Box>
            <Typography variant="caption" color="text.secondary">
              Код приглашения
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <Typography
                variant="h6"
                sx={{ fontFamily: 'monospace', letterSpacing: 4, flexGrow: 1 }}
              >
                {group.inviteCode}
              </Typography>
              <IconButton size="small" onClick={handleCopy}>
                <ContentCopyIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={handleShare}>
                <ShareIcon fontSize="small" />
              </IconButton>
              {copied && (
                <Typography variant="caption" color="success.main">
                  Скопировано
                </Typography>
              )}
            </Box>
          </Box>

          <Divider />

          <Box>
            <Typography variant="caption" color="text.secondary">
              Участники
            </Typography>
            <List dense disablePadding>
              {group.members.map((member) => {
                const displayName = getMemberDisplayName(member.telegramId, member.name);
                const isMe = member.telegramId === currentUserId;
                const isEditing = editingDisplayName === member.telegramId;
                return (
                  <ListItem
                    key={member.telegramId}
                    disableGutters
                    secondaryAction={
                      <Box display="flex">
                        {onUpdateDisplayName && isMe && !isEditing && (
                          <IconButton
                            size="small"
                            onClick={() => startEditDisplayName(member.telegramId)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        )}
                        {isOwner && !isMe && (
                          <IconButton
                            size="small"
                            edge="end"
                            onClick={() => setMemberToRemove(member.telegramId)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar src={member.photoUrl} sx={{ width: 32, height: 32 }}>
                        {displayName[0]}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        isEditing ? (
                          <TextField
                            value={displayNameValue}
                            onChange={e => setDisplayNameValue(e.target.value)}
                            onBlur={saveDisplayName}
                            onKeyDown={e => e.key === 'Enter' && saveDisplayName()}
                            size="small"
                            autoFocus
                            placeholder="Имя в группе"
                            sx={{ width: 140 }}
                          />
                        ) : (
                          displayName
                        )
                      }
                      secondary={
                        member.telegramId === group.ownerTelegramId
                          ? 'Владелец'
                          : isMe
                          ? 'Вы'
                          : null
                      }
                    />
                  </ListItem>
                );
              })}
            </List>
          </Box>

          {onUpdateMockMembers && isOwner && (
            <>
              <Divider />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Гости (без Telegram)
                </Typography>
                <List dense disablePadding>
                  {mockMembers.map(m => {
                    const displayName = memberDisplayNames[m.id] ?? m.name;
                    const isEditing = editingDisplayName === m.id;
                    return (
                      <ListItem
                        key={m.id}
                        disableGutters
                        secondaryAction={
                          <Box display="flex">
                            {onUpdateDisplayName && !isEditing && (
                              <IconButton size="small" onClick={() => startEditDisplayName(m.id)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            )}
                            <IconButton size="small" edge="end" onClick={() => handleRemoveMockMember(m.id)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        }
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: 'grey.400' }}>
                            {displayName[0]}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            isEditing ? (
                              <TextField
                                value={displayNameValue}
                                onChange={e => setDisplayNameValue(e.target.value)}
                                onBlur={saveDisplayName}
                                onKeyDown={e => e.key === 'Enter' && saveDisplayName()}
                                size="small"
                                autoFocus
                                placeholder="Имя"
                                sx={{ width: 140 }}
                              />
                            ) : (
                              displayName
                            )
                          }
                          secondary="Гость"
                        />
                      </ListItem>
                    );
                  })}
                </List>
                <Box display="flex" gap={1} mt={1}>
                  <TextField
                    label="Имя гостя"
                    value={newMockName}
                    onChange={e => setNewMockName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddMockMember()}
                    size="small"
                    fullWidth
                  />
                  <IconButton onClick={handleAddMockMember} disabled={!newMockName.trim()}>
                    <AddIcon />
                  </IconButton>
                </Box>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ flexDirection: 'column', alignItems: 'stretch', gap: 1, px: 3, pb: 2 }}>
          {isOwner ? (
            <Button color="error" onClick={() => setDeleteConfirmOpen(true)} fullWidth>
              Удалить группу
            </Button>
          ) : (
            <Button color="error" onClick={() => setLeaveConfirmOpen(true)} fullWidth>
              Покинуть группу
            </Button>
          )}
          <Button onClick={onClose} fullWidth>
            Закрыть
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={deleteConfirmOpen}
        title="Удалить группу?"
        description={`Группа «${group.name}» и все её данные будут удалены безвозвратно.`}
        confirmLabel="Удалить"
        onConfirm={() => { setDeleteConfirmOpen(false); onDelete(); }}
        onCancel={() => setDeleteConfirmOpen(false)}
      />

      <ConfirmDialog
        open={leaveConfirmOpen}
        title="Покинуть группу?"
        description={`Вы выйдете из группы «${group.name}». Чтобы вернуться, потребуется код приглашения.`}
        confirmLabel="Покинуть"
        onConfirm={() => { setLeaveConfirmOpen(false); onLeave(); }}
        onCancel={() => setLeaveConfirmOpen(false)}
      />

      <ConfirmDialog
        open={Boolean(memberToRemove)}
        title="Удалить участника?"
        description={memberToRemoveObj ? `«${getMemberDisplayName(memberToRemoveObj.telegramId, memberToRemoveObj.name)}» будет удалён из группы.` : ''}
        confirmLabel="Удалить"
        onConfirm={() => {
          if (memberToRemove) onRemoveMember(memberToRemove);
          setMemberToRemove(null);
        }}
        onCancel={() => setMemberToRemove(null)}
      />
    </>
  );
}
