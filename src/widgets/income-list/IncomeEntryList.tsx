import { List } from '@mui/material';

import { IncomeEntry } from '@/shared/types';

import { IncomeEntryItem } from './IncomeEntryItem';

interface Props {
  entries: IncomeEntry[];
  onDelete: (id: string) => void;
  onEdit: (entry: IncomeEntry) => void;
}

export function IncomeEntryList({ entries, onDelete, onEdit }: Props) {
  return (
    <List disablePadding>
      {entries.map((e) => (
        <IncomeEntryItem key={e.id} entry={e} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </List>
  );
}
