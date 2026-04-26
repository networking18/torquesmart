import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#00ff88',
    secondary: '#00cc6a',
    background: '#0a0a0a',
    surface: '#1a1a1a',
    onPrimary: '#000000',
    onSecondary: '#000000',
    onBackground: '#ffffff',
    onSurface: '#ffffff',
    outline: '#333',
    outlineVariant: '#444',
  },
  roundness: 10,
  fonts: {
    ...MD3DarkTheme.fonts,
    bodyLarge: {
      ...MD3DarkTheme.fonts.bodyLarge,
      fontSize: 16,
    },
    bodyMedium: {
      ...MD3DarkTheme.fonts.bodyMedium,
      fontSize: 14,
    },
    bodySmall: {
      ...MD3DarkTheme.fonts.bodySmall,
      fontSize: 12,
    },
  },
};
