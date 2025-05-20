import { useCallback, useEffect, useState } from 'react';

import { Theme, theme } from '../styles/theme';

type ThemeMode = 'light' | 'dark' | 'system';

export function useTheme() {
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      if (themeMode === 'system') {
        setResolvedTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themeMode]);

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeMode(mode);
    if (mode === 'system') {
      setResolvedTheme(
        window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
      );
    } else {
      setResolvedTheme(mode);
    }
  }, []);

  return {
    theme,
    themeMode,
    resolvedTheme,
    setTheme,
  };
}
