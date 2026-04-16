import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItem,
  Typography
} from '@mui/material';

import { GroupEventExpense, GroupMember, MockMember } from '@/shared/types';
import { Transfer, computeSettlement } from '@/shared/utils';

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
  currentUserId: string;
  onCloseDebt?: (toId: string) => void;
}

export function SettlementDialog({
  open,
  onClose,
  expenses,
  realMembers,
  mockMembers,
  memberDisplayNames,
  currentUserId,
  onCloseDebt
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

  const myDebts = transfers.filter(t => t.fromId === currentUserId);
  const myCredits = transfers.filter(t => t.toId === currentUserId);
  const others = transfers.filter(t => t.fromId !== currentUserId && t.toId !== currentUserId);

  const renderTransfer = (t: Transfer, showCloseBtn: boolean) => (
    <ListItem key={`${t.fromId}_${t.toId}`} disablePadding sx={{ py: 0.75 }}>
      <Box sx={{ width: '100%' }}>
        <Box display="flex" alignItems="center" gap={0.5}>
          <Typography variant="body2" fontWeight={showCloseBtn || t.toId === currentUserId ? 600 : 400}>
            {getName(t.fromId)}
          </Typography>
          <ArrowForwardIcon sx={{ fontSize: 14, color: 'text.secondary', flexShrink: 0 }} />
          <Typography variant="body2">{getName(t.toId)}</Typography>
          <Typography variant="body2" fontWeight={600} sx={{ ml: 'auto' }}>
            {t.amount} ₽
          </Typography>
        </Box>
        {showCloseBtn && onCloseDebt && (
          <Button
            size="small"
            color="success"
            onClick={() => onCloseDebt(t.toId)}
            sx={{ mt: 0.25, p: 0, minWidth: 0, textTransform: 'none' }}
          >
            Я перевёл — закрыть долг
          </Button>
        )}
      </Box>
    </ListItem>
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Итог</DialogTitle>
      <DialogContent sx={{ pt: 0 }}>
        <Typography variant="caption" color="text.secondary">
          Всего потрачено: {totalExpenses} ₽
        </Typography>

        {transfers.length === 0 ? (
          <Box sx={{ py: 3, textAlign: 'center' }}>
            <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
            <Typography color="text.secondary">Все расчёты завершены</Typography>
          </Box>
        ) : (
          <>
            {myDebts.length > 0 && (
              <>
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }} color="error.main">
                  Вы должны перевести
                </Typography>
                <List disablePadding>
                  {myDebts.map(t => renderTransfer(t, true))}
                </List>
              </>
            )}

            {myCredits.length > 0 && (
              <>
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }} color="success.main">
                  Вам должны перевести
                </Typography>
                <List disablePadding>
                  {myCredits.map(t => renderTransfer(t, false))}
                </List>
              </>
            )}

            {others.length > 0 && (
              <>
                {(myDebts.length > 0 || myCredits.length > 0) && (
                  <Divider sx={{ mt: 2 }} />
                )}
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }} color="text.secondary">
                  Остальные переводы
                </Typography>
                <List disablePadding>
                  {others.map(t => renderTransfer(t, false))}
                </List>
              </>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
