export const THEME_OPTIONS = [
  { id: 'midnight', label: 'Midnight' },
  { id: 'neon', label: 'Neon' },
  { id: 'sunset', label: 'Sunset' },
  { id: 'forest', label: 'Forest' },
];

export const DEFAULT_THEME = 'midnight';

export const isValidTheme = (value) => THEME_OPTIONS.some((theme) => theme.id === value);
