import styled from '@emotion/styled';
import { Dialog } from '@mui/material';

export const StyledDialog = styled(Dialog)(() => ({
  '& .MuiDialog-paper': {
    margin: '0',
    width: 'calc(100% - 40px)',
    padding: '10px 0'
  }
}));
