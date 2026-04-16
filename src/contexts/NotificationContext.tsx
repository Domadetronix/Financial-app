import { Alert, AlertColor, Snackbar } from '@mui/material';
import React, { createContext, ReactNode, useContext, useState } from 'react';

const NotificationContext = createContext<(msg: string, severity?: AlertColor) => void>(() => {});

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertColor>('success');

  const showNotification = (msg: string, sev: AlertColor = 'success') => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

  return (
    <NotificationContext.Provider value={showNotification}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={2500}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={severity} onClose={() => setOpen(false)} variant="filled" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
