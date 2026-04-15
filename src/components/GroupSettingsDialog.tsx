import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
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
import React, { useEffect, useState } from 'react';

import { Group } from '../types';

interface Props {
  open: boolean;
  onClose: () => void;
  group: Group;
  currentUserId: string;
  onRename: (name: string) => void;
  onRemoveMember: (telegramId: string) => void;
  onLeave: () => void;
  onDelete: () => void;
}

export const GroupSettingsDialog: React.FC<Props> = ({
  open,
  onClose,
  group,
  currentUserId,
  onRename,
  onRemoveMember,
  onLeave,
  onDelete
}) => {
  const [name, setName] = useState(group.name);
  const [copied, setCopied] = useState(false);
  const isOwner = group.ownerTelegramId === currentUserId;

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

  return (
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
            {group.members.map((member) => (
              <ListItem
                key={member.telegramId}
                disableGutters
                secondaryAction={
                  isOwner && member.telegramId !== currentUserId ? (
                    <IconButton
                      size="small"
                      edge="end"
                      onClick={() => onRemoveMember(member.telegramId)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  ) : null
                }
              >
                <ListItemAvatar>
                  <Avatar src={member.photoUrl} sx={{ width: 32, height: 32 }}>
                    {member.name[0]}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={member.name}
                  secondary={member.telegramId === group.ownerTelegramId ? 'Владелец' : null}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </DialogContent>
      <DialogActions sx={{ flexDirection: 'column', alignItems: 'stretch', gap: 1, px: 3, pb: 2 }}>
        {isOwner ? (
          <Button color="error" onClick={onDelete} fullWidth>
            Удалить группу
          </Button>
        ) : (
          <Button color="error" onClick={onLeave} fullWidth>
            Покинуть группу
          </Button>
        )}
        <Button onClick={onClose} fullWidth>
          Закрыть
        </Button>
      </DialogActions>
    </Dialog>
  );
};
