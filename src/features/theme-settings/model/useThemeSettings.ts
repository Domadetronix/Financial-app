import { useCallback, useEffect, useState } from 'react';

import { DEFAULT_THEME_COLOR } from '@/shared/config';
import { loadUserSettings, saveUserSettings } from '@/shared/lib';

export function useThemeSettings(userId: string) {
  const [primaryColor, setPrimaryColorState] = useState<string>(DEFAULT_THEME_COLOR);

  useEffect(() => {
    loadUserSettings(userId).then(settings => {
      if (settings.primaryColor && typeof settings.primaryColor === 'string') {
        setPrimaryColorState(settings.primaryColor);
      }
    });
  }, [userId]);

  const setPrimaryColor = useCallback((color: string) => {
    setPrimaryColorState(color);
    saveUserSettings(userId, { primaryColor: color });
  }, [userId]);

  return { primaryColor, setPrimaryColor };
}
