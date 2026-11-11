import { useColorScheme } from 'react-native';

export type Theme = {
  dark: boolean;
  background: string;
  card: string;
  text: string;
  secondaryText: string;
  border: string;
  accent: string;
  accentText: string;
  danger: string;
  success: string;
};

const light: Theme = {
  dark: false,
  background: '#F2F2F7',
  card: '#FFFFFF',
  text: '#1C1C1E',
  secondaryText: '#6C6C70',
  border: '#D1D1D6',
  accent: '#0A84FF',
  accentText: '#FFFFFF',
  danger: '#FF3B30',
  success: '#34C759',
};

const dark: Theme = {
  dark: true,
  background: '#000000',
  card: '#1C1C1E',
  text: '#F2F2F7',
  secondaryText: '#AEAEB2',
  border: '#38383A',
  accent: '#0A84FF',
  accentText: '#FFFFFF',
  danger: '#FF453A',
  success: '#30D158',
};

export function useTheme(): Theme {
  return useColorScheme() === 'dark' ? dark : light;
}

/** A small palette used by several demos. */
export const swatches = ['#FF6B6B', '#FFA94D', '#FFD43B', '#69DB7C', '#38D9A9', '#4DABF7', '#748FFC', '#DA77F2'];
