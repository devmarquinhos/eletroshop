/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#1A1D29',
    background: '#F5F7FA',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#E2E5EB',
    textSecondary: '#6B7280',
  },
  dark: {
    text: '#F5F7FA',
    background: '#0F1117',
    backgroundElement: '#1A1D29',
    backgroundSelected: '#263149',
    textSecondary: '#A7AFBF',
  },
} as const;

export const EletroShopColors = {
  primary: '#0052FF',
  primaryDark: '#0038B8',
  accent: '#FF6B00',
  success: '#00C853',
  danger: '#E53935',
  border: '#E2E5EB',
  darkPrimary: '#3D7FFF',
  darkAccent: '#FF8533',
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
