import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Typography
} from '@mui/material';

import { GroupEventExpense, GroupMember, MockMember } from '@/shared/types';
import { computeSettlement } from '@/shared/utils';

interface AllMember {
  id: string;
  name: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  expenses: GroupEventExpense[];
  realMembers: GroupMember[];
  mockMembers: MockMember[];
  memberDisplayNames: Record<string, string>;
}

export function SettlementDialog({
  open,
  onClose,
  expenses,
  realMembers,
  mockMembers,
  memberDisplayNames
}: Props) {
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

  const getName = (id: string) => allMembers.find(m => m.id === id)?.name ?? id;

  const transfers = computeSettlement(expenses);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Итог</DialogTitle>
      <DialogContent sx={{ pt: 0 }}>
        <Typography variant="caption" color="text.secondary" gutterBottom>
          Всего потрачено: {totalExpenses} ₽
        </Typography>

        {transfers.length === 0 ? (
          <Box sx={{ py: 3, textAlign: 'center' }}>
            <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
            <Typography color="text.secondary">Все расчёты завершены</Typography>
          </Box>
        ) : (
          <>
            <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
              Нужно перевести
            </Typography>
            <List disablePadding>
              {transfers.map(t => (
                <ListItem key={`${t.fromId}_${t.toId}`} disablePadding sx={{ py: 0.5 }}>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Typography variant="body2" fontWeight={600}>
                          {getName(t.fromId)}
                        </Typography>
                        <ArrowForwardIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="body2">{getName(t.toId)}</Typography>
                        <Typography variant="body2" fontWeight={600} sx={{ ml: 'auto' }}>
                          {t.amount} ₽
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
