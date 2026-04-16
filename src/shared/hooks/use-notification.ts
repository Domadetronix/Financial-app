import { AlertColor } from '@mui/material';
import { createContext, useContext } from 'react';

export const NotificationContext = createContext<(msg: string, severity?: AlertColor) => void>(() => {});

export const useNotification = () => useContext(NotificationContext);
