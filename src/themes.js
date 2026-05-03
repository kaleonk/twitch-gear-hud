export const THEME_OPTIONS = [
  { id: 'midnight', label: 'Midnight' },
  { id: 'ember', label: 'Ember' },
  { id: 'frost', label: 'Frost' },
  { id: 'neon', label: 'Neon' },
  { id: 'sunset', label: 'Sunset (Legacy)' },
  { id: 'forest', label: 'Forest (Legacy)' },
];

export const DEFAULT_THEME = 'midnight';

export const isValidTheme = (value) => THEME_OPTIONS.some((theme) => theme.id === value);
