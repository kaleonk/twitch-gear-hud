export const DEFAULT_THEME = 'midnight';

export const THEME_OPTIONS = [
  { id: 'midnight', label: 'Midnight Blue' },
  { id: 'neon', label: 'Neon Purple' },
  { id: 'frost', label: 'Frost White' },
  { id: 'forest', label: 'Cyber Green' },
  { id: 'ember', label: 'Sunset Orange' },
];

export const isValidTheme = (value) => THEME_OPTIONS.some((theme) => theme.id === value);