import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material';
import { ReactNode, useMemo } from 'react';

interface Props {
  primaryColor: string;
  children: ReactNode;
}

export function AppThemeProvider({ primaryColor, children }: Props) {
  const theme = useMemo(
    () => createTheme({ palette: { primary: { main: primaryColor } } }),
    [primaryColor]
  );
  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
}
