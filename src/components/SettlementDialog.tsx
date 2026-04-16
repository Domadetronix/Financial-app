import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import {
  Box,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography
} from '@mui/material';
import React from 'react';

import { GroupEventExpense, GroupMember, MockMember } from '../types';
import { computeSettlement } from '../utils/settlement';

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
  settlementPaid: Record<string, boolean>;
  onTogglePaid: (fromId: string, toId: string, paid: boolean) => void;
}

export const SettlementDialog: React.FC<Props> = ({
  open,
  onClose,
  expenses,
  realMembers,
  mockMembers,
  memberDisplayNames,
  settlementPaid,
  onTogglePaid
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

  const getName = (id: string) => allMembers.find(m => m.id === id)?.name ?? id;

  const transfers = computeSettlement(expenses);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  const paidKey = (fromId: string, toId: string) => `${fromId}_${toId}`;

  const pending = transfers.filter(t => !settlementPaid[paidKey(t.fromId, t.toId)]);
  const done = transfers.filter(t => settlementPaid[paidKey(t.fromId, t.toId)]);

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
            {pending.length > 0 && (
              <>
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
                  Нужно перевести
                </Typography>
                <List disablePadding>
                  {pending.map(t => {
                    const key = paidKey(t.fromId, t.toId);
                    return (
                      <ListItem key={key} disablePadding>
                        <Checkbox
                          icon={<RadioButtonUncheckedIcon />}
                          checkedIcon={<CheckCircleIcon />}
                          checked={false}
                          onChange={() => onTogglePaid(t.fromId, t.toId, true)}
                          size="small"
                          sx={{ pl: 0 }}
                        />
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={0.5}>
                              <Typography variant="body2" fontWeight={600}>
                                {getName(t.fromId)}
                              </Typography>
                              <ArrowForwardIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                              <Typography variant="body2">
                                {getName(t.toId)}
                              </Typography>
                              <Typography variant="body2" fontWeight={600} sx={{ ml: 'auto' }}>
                                {t.amount} ₽
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </>
            )}

            {done.length > 0 && (
              <>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Оплачено
                </Typography>
                <List disablePadding>
                  {done.map(t => {
                    const key = paidKey(t.fromId, t.toId);
                    return (
                      <ListItem key={key} disablePadding>
                        <Checkbox
                          icon={<RadioButtonUncheckedIcon />}
                          checkedIcon={<CheckCircleIcon />}
                          checked
                          onChange={() => onTogglePaid(t.fromId, t.toId, false)}
                          size="small"
                          sx={{ pl: 0 }}
                          color="success"
                        />
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={0.5} sx={{ opacity: 0.5 }}>
                              <Typography variant="body2" sx={{ textDecoration: 'line-through' }}>
                                {getName(t.fromId)}
                              </Typography>
                              <ArrowForwardIcon sx={{ fontSize: 14 }} />
                              <Typography variant="body2" sx={{ textDecoration: 'line-through' }}>
                                {getName(t.toId)}
                              </Typography>
                              <Typography variant="body2" sx={{ ml: 'auto', textDecoration: 'line-through' }}>
                                {t.amount} ₽
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
