export const getGridTheme = (theme: string) => {
  const currentTheme = theme || 'dark';
  switch (currentTheme) {
    case 'light':
      return 'MODERN_LIGHT';
    case 'dark':
    default:
      return 'PROFESSIONAL_DARK';
  }
};
