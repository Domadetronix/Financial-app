import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

import { THEME_COLORS } from '@/shared/config';

interface Props {
  open: boolean;
  currentColor: string;
  onSelect: (color: string) => void;
  onClose: () => void;
}

export function ThemeSettingsDialog({ open, currentColor, onSelect, onClose }: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Цвет темы</DialogTitle>
      <DialogContent>
        <Box display="flex" flexWrap="wrap" gap={1.5} mt={0.5}>
          {THEME_COLORS.map(color => (
            <Box
              key={color}
              onClick={() => onSelect(color)}
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: color,
                cursor: 'pointer',
                border: color === currentColor ? '3px solid #fff' : '3px solid transparent',
                outline: color === currentColor ? `3px solid ${color}` : 'none',
                transition: 'outline 0.15s'
              }}
            />
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Закрыть</Button>
      </DialogActions>
    </Dialog>
  );
}
