import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, ListItem, ListItemText } from '@mui/material';
import { useState } from 'react';

import { IncomeEntry } from '@/shared/types';
import { ConfirmDialog } from '@/shared/ui';

interface Props {
  entry: IncomeEntry;
  onDelete: (id: string) => void;
  onEdit: (entry: IncomeEntry) => void;
}

export function IncomeEntryItem({ entry, onDelete, onEdit }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <ListItem
        sx={{ border: '1px solid #ddd', borderRadius: 2, my: 1, paddingRight: '96px' }}
        secondaryAction={
          <>
            <IconButton onClick={() => onEdit(entry)}>
              <EditIcon />
            </IconButton>
            <IconButton color="error" onClick={() => setConfirmOpen(true)}>
              <DeleteIcon />
            </IconButton>
          </>
        }
      >
        <ListItemText primary={entry.name} secondary={`${entry.amount} ₽`} />
      </ListItem>

      <ConfirmDialog
        open={confirmOpen}
        title="Удалить доход?"
        description={`«${entry.name}» будет удалён безвозвратно.`}
        onConfirm={() => { setConfirmOpen(false); onDelete(entry.id); }}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
