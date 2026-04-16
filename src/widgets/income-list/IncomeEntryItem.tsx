import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, ListItem, ListItemText } from '@mui/material';

import { IncomeEntry } from '@/shared/types';

interface Props {
  entry: IncomeEntry;
  onDelete: (id: string) => void;
  onEdit: (entry: IncomeEntry) => void;
}

export function IncomeEntryItem({ entry, onDelete, onEdit }: Props) {
  return (
    <ListItem
      sx={{ border: '1px solid #ddd', borderRadius: 2, my: 1, paddingRight: '96px' }}
      secondaryAction={
        <>
          <IconButton onClick={() => onEdit(entry)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => onDelete(entry.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      }
    >
      <ListItemText primary={entry.name} secondary={`${entry.amount} ₽`} />
    </ListItem>
  );
}
