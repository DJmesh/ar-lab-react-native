/**
 * Shared — Navigation Theme Builder
 * @description Gera o tema de navegação baseado no tema ativo da aplicação.
 */
import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';
import type { AppTheme } from './tokens';

export const buildNavigationTheme = (appTheme: AppTheme): Theme => {
  const base = appTheme.mode === 'dark' ? DarkTheme : DefaultTheme;
  const c    = appTheme.colors;

  return {
    ...base,
    colors: {
      ...base.colors,
      primary:      c.brand.primary,
      background:   c.bg.primary,
      card:         c.bg.secondary,
      text:         c.text.primary,
      border:       c.border.subtle,
      notification: c.semantic.error,
    },
  };
};

// Alias legado (para compatibilidade com App.tsx)
export const navigationTheme = {
  dark:   true,
  colors: {
    primary:      '#3B82F6',
    background:   '#0A0E1A',
    card:         '#111827',
    text:         '#F9FAFB',
    border:       'rgba(255,255,255,0.07)',
    notification: '#EF4444',
  },
};
