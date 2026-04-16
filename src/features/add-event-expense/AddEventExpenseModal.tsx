import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import { useState } from 'react';

import { GroupEventExpense, GroupMember, MockMember } from '@/shared/types';

interface AllMember {
  id: string;
  name: string;
}

interface Props {
  currentUserId: string;
  realMembers: GroupMember[];
  mockMembers: MockMember[];
  memberDisplayNames: Record<string, string>;
  onAdd: (expense: Omit<GroupEventExpense, 'id' | 'createdAt'>) => void;
}

export function AddEventExpenseModal({
  currentUserId,
  realMembers,
  mockMembers,
  memberDisplayNames,
  onAdd
}: Props) {
  const [open, setOpen] = useState(false);

  const allMembers: AllMember[] = [
    ...realMembers.map(m => ({
      id: m.telegramId,
      name: memberDisplayNames[m.telegramId] ?? m.name
    })),
    ...mockMembers.map(m => ({
      id: m.id,
      name: memberDisplayNames[m.id] ?? m.name
    }))
  ];

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [participantIds, setParticipantIds] = useState<string[]>(allMembers.map(m => m.id));
  const [paidById, setPaidById] = useState(currentUserId);

  const handleOpen = () => {
    setName('');
    setAmount('');
    setParticipantIds(allMembers.map(m => m.id));
    setPaidById(currentUserId);
    setOpen(true);
  };

  const toggleParticipant = (id: string) => {
    setParticipantIds(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleAdd = () => {
    const parsed = parseFloat(amount);
    if (!name.trim() || isNaN(parsed) || parsed <= 0) return;
    if (participantIds.length === 0) return;

    onAdd({
      name: name.trim(),
      amount: parsed,
      addedByTelegramId: currentUserId,
      paidById,
      participantIds
    });

    setOpen(false);
  };

  return (
    <>
      <Button variant="contained" fullWidth onClick={handleOpen}>
        Добавить трату
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Новая трата</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 0.5 }}>
            <Box display="flex" gap={1}>
              <TextField
                label="Название"
                value={name}
                onChange={e => setName(e.target.value)}
                size="small"
                fullWidth
              />
              <TextField
                label="Сумма"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                slotProps={{ htmlInput: { inputMode: 'decimal' } }}
                size="small"
                sx={{ width: 120 }}
              />
            </Box>

            <FormControl fullWidth size="small">
              <InputLabel>Оплатил</InputLabel>
              <Select
                value={paidById}
                label="Оплатил"
                onChange={e => setPaidById(e.target.value)}
              >
                {allMembers.map(m => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                Причастные ({participantIds.length})
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={0.5}>
                {allMembers.map(m => (
                  <Chip
                    key={m.id}
                    label={m.name}
                    size="small"
                    color={participantIds.includes(m.id) ? 'primary' : 'default'}
                    onClick={() => toggleParticipant(m.id)}
                    variant={participantIds.includes(m.id) ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>
            </Box>

            <Button
              variant="contained"
              fullWidth
              onClick={handleAdd}
              disabled={!name.trim() || !amount || participantIds.length === 0}
            >
              Добавить
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
