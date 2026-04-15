import { List } from '@mui/material';
import React from 'react';

import { IncomeEntry } from '../types';
import { IncomeEntryItem } from './IncomeEntryItem';

interface Props {
  entries: IncomeEntry[];
  onDelete: (id: string) => void;
  onEdit: (entry: IncomeEntry) => void;
}

export const IncomeEntryList: React.FC<Props> = ({ entries, onDelete, onEdit }) => {
  return (
    <List disablePadding>
      {entries.map((e) => (
        <IncomeEntryItem key={e.id} entry={e} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </List>
  );
};
