import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import React, { useState } from 'react';

import { GroupEventExpense, GroupMember, MockMember } from '../types';

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

export const EventExpenseForm: React.FC<Props> = ({
  currentUserId,
  realMembers,
  mockMembers,
  memberDisplayNames,
  onAdd
}) => {
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

  // Синхронизируем участников при изменении списка участников
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

    setName('');
    setAmount('');
    setParticipantIds(allMembers.map(m => m.id));
    setPaidById(currentUserId);
  };

  return (
    <Box>
      <Box display="flex" gap={1} mb={1}>
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

      {/* Оплативший */}
      <FormControl fullWidth size="small" sx={{ mb: 1.5 }}>
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

      {/* Участники */}
      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
        Причастные ({participantIds.length})
      </Typography>
      <Box display="flex" flexWrap="wrap" gap={0.5} mb={1.5}>
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

      <Button
        variant="contained"
        fullWidth
        onClick={handleAdd}
        disabled={!name.trim() || !amount || participantIds.length === 0}
      >
        Добавить
      </Button>
    </Box>
  );
};
