import { useEffect } from 'react';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export interface TelegramWebApp {
  initDataUnsafe?: { user?: TelegramUser };
  ready: () => void;
  MainButton: {
    text: string;
    show: () => void;
    hide: () => void;
    onClick: (cb: () => void) => void;
    offClick: (cb: () => void) => void;
  };
  themeParams?: Record<string, string>;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

export function useTelegram() {
  const tg = window?.Telegram?.WebApp ?? null;
  const user = tg?.initDataUnsafe?.user ?? null;

  useEffect(() => {
    tg?.ready();
  }, []);

  return { tg, user };
}
