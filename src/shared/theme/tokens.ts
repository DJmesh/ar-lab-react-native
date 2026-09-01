/**
 * Shared — Design Tokens (Dark & Light Themes)
 *
 * @description Sistema de design dual-theme completo.
 * Cada tema define a mesma estrutura de tokens, permitindo troca em runtime
 * sem qualquer StyleSheet duplicado nos componentes.
 *
 * Paleta Dark: otimizada para ambientes de laboratório (baixa luminosidade).
 * Paleta Light: limpa, acadêmica, alto contraste para ambientes externos.
 */
import { rf, rs, rh } from '../utils/responsive';

// ─────────────────────────────────────────────────────────────────────────────
// TIPO BASE DO TEMA
// ─────────────────────────────────────────────────────────────────────────────

export interface AppTheme {
  /** Identificador do tema */
  mode: 'dark' | 'light';

  colors: {
    /** Backgrounds em camadas (primary > secondary > tertiary) */
    bg: {
      primary: string;
      secondary: string;
      tertiary: string;
      elevated: string;
      overlay: string;
    };

    /** Cores de marca do produto */
    brand: {
      primary: string;
      secondary: string;
      accent: string;
      glow: string;
    };

    /** Cores semânticas */
    semantic: {
      success: string;
      successBg: string;
      warning: string;
      warningBg: string;
      error: string;
      errorBg: string;
      info: string;
      infoBg: string;
    };

    /** Hierarquia de texto */
    text: {
      primary: string;
      secondary: string;
      tertiary: string;
      inverse: string;
      onBrand: string;
    };

    /** Bordas e separadores */
    border: {
      subtle: string;
      medium: string;
      strong: string;
      accent: string;
    };

    /** Gradientes (arrays para LinearGradient) */
    gradient: {
      hero: string[];
      card: string[];
      accent: string[];
      ar: string[];
      scanLine: string[];
    };
  };

  /** Tipografia escalada responsivamente */
  typography: {
    size: {
      xs: number;
      sm: number;
      base: number;
      md: number;
      lg: number;
      xl: number;
      '2xl': number;
      '3xl': number;
    };
    weight: {
      regular: '400';
      medium: '500';
      semibold: '600';
      bold: '700';
      extrabold: '800';
    };
    lineHeight: {
      tight: number;
      normal: number;
      relaxed: number;
    };
  };

  /** Espaçamentos responsivos */
  spacing: {
    xs: number;
    sm: number;
    md: number;
    base: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
    '4xl': number;
  };

  /** Border radius */
  radius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
    full: number;
  };

  /** Sombras nativas */
  shadows: {
    card: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    glow: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// TOKENS BASE COMPARTILHADOS (independentes do tema)
// ─────────────────────────────────────────────────────────────────────────────

const baseTypography: AppTheme['typography'] = {
  size: {
    xs:   rf(11),
    sm:   rf(13),
    base: rf(15),
    md:   rf(17),
    lg:   rf(20),
    xl:   rf(24),
    '2xl': rf(28),
    '3xl': rf(34),
  },
  weight: {
    regular:   '400',
    medium:    '500',
    semibold:  '600',
    bold:      '700',
    extrabold: '800',
  },
  lineHeight: {
    tight:   1.2,
    normal:  1.5,
    relaxed: 1.75,
  },
};

const baseSpacing: AppTheme['spacing'] = {
  xs:   rs(4),
  sm:   rs(8),
  md:   rs(12),
  base: rs(16),
  lg:   rs(20),
  xl:   rs(24),
  '2xl': rs(32),
  '3xl': rs(40),
  '4xl': rs(48),
};

const baseRadius: AppTheme['radius'] = {
  sm:   rs(6),
  md:   rs(10),
  lg:   rs(16),
  xl:   rs(20),
  '2xl': rs(24),
  full: 9999,
};

// ─────────────────────────────────────────────────────────────────────────────
// TEMA ESCURO
// ─────────────────────────────────────────────────────────────────────────────

export const darkTheme: AppTheme = {
  mode: 'dark',

  colors: {
    bg: {
      primary:   '#0A0E1A',
      secondary: '#111827',
      tertiary:  '#1C2537',
      elevated:  '#243044',
      overlay:   'rgba(10, 14, 26, 0.92)',
    },
    brand: {
      primary:   '#3B82F6',
      secondary: '#6366F1',
      accent:    '#22D3EE',
      glow:      'rgba(34, 211, 238, 0.10)',
    },
    semantic: {
      success:   '#10B981',
      successBg: 'rgba(16, 185, 129, 0.12)',
      warning:   '#F59E0B',
      warningBg: 'rgba(245, 158, 11, 0.12)',
      error:     '#EF4444',
      errorBg:   'rgba(239, 68, 68, 0.12)',
      info:      '#3B82F6',
      infoBg:    'rgba(59, 130, 246, 0.12)',
    },
    text: {
      primary:   '#F9FAFB',
      secondary: '#9CA3AF',
      tertiary:  '#6B7280',
      inverse:   '#0A0E1A',
      onBrand:   '#FFFFFF',
    },
    border: {
      subtle: 'rgba(255, 255, 255, 0.07)',
      medium: 'rgba(255, 255, 255, 0.12)',
      strong: 'rgba(255, 255, 255, 0.22)',
      accent: 'rgba(34, 211, 238, 0.35)',
    },
    gradient: {
      hero:     ['#0A0E1A', '#111827'],
      card:     ['#111827', '#1C2537'],
      accent:   ['#3B82F6', '#6366F1'],
      ar:       ['rgba(0,0,0,0)', 'rgba(34,211,238,0.08)'],
      scanLine: ['transparent', '#22D3EE', 'transparent'],
    },
  },

  typography: baseTypography,
  spacing:    baseSpacing,
  radius:     baseRadius,

  shadows: {
    card: {
      shadowColor:   '#22D3EE',
      shadowOffset:  { width: 0, height: rh(4) },
      shadowOpacity: 0.10,
      shadowRadius:  12,
      elevation:     6,
    },
    glow: {
      shadowColor:   '#22D3EE',
      shadowOffset:  { width: 0, height: 0 },
      shadowOpacity: 0.35,
      shadowRadius:  20,
      elevation:     10,
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// TEMA CLARO
// ─────────────────────────────────────────────────────────────────────────────

export const lightTheme: AppTheme = {
  mode: 'light',

  colors: {
    bg: {
      primary:   '#F0F4FF',
      secondary: '#FFFFFF',
      tertiary:  '#E8EFF8',
      elevated:  '#FFFFFF',
      overlay:   'rgba(240, 244, 255, 0.95)',
    },
    brand: {
      primary:   '#2563EB',
      secondary: '#4F46E5',
      accent:    '#0891B2',
      glow:      'rgba(8, 145, 178, 0.08)',
    },
    semantic: {
      success:   '#059669',
      successBg: 'rgba(5, 150, 105, 0.08)',
      warning:   '#D97706',
      warningBg: 'rgba(217, 119, 6, 0.08)',
      error:     '#DC2626',
      errorBg:   'rgba(220, 38, 38, 0.08)',
      info:      '#2563EB',
      infoBg:    'rgba(37, 99, 235, 0.08)',
    },
    text: {
      primary:   '#0F172A',
      secondary: '#475569',
      tertiary:  '#94A3B8',
      inverse:   '#FFFFFF',
      onBrand:   '#FFFFFF',
    },
    border: {
      subtle: 'rgba(15, 23, 42, 0.06)',
      medium: 'rgba(15, 23, 42, 0.10)',
      strong: 'rgba(15, 23, 42, 0.20)',
      accent: 'rgba(8, 145, 178, 0.30)',
    },
    gradient: {
      hero:     ['#F0F4FF', '#FFFFFF'],
      card:     ['#FFFFFF', '#F0F4FF'],
      accent:   ['#2563EB', '#4F46E5'],
      ar:       ['rgba(240,244,255,0)', 'rgba(8,145,178,0.06)'],
      scanLine: ['transparent', '#0891B2', 'transparent'],
    },
  },

  typography: baseTypography,
  spacing:    baseSpacing,
  radius:     baseRadius,

  shadows: {
    card: {
      shadowColor:   '#0F172A',
      shadowOffset:  { width: 0, height: rh(2) },
      shadowOpacity: 0.08,
      shadowRadius:  10,
      elevation:     4,
    },
    glow: {
      shadowColor:   '#0891B2',
      shadowOffset:  { width: 0, height: 0 },
      shadowOpacity: 0.20,
      shadowRadius:  16,
      elevation:     8,
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// ALIASES LEGADOS (compatibilidade com código anterior)
// ─────────────────────────────────────────────────────────────────────────────
export const Colors     = darkTheme.colors;
export const Typography = darkTheme.typography;
export const Spacing    = darkTheme.spacing;
export const Radius     = darkTheme.radius;
export const Shadows    = darkTheme.shadows;

// Durations de animação (independentes do tema)
export const Duration = {
  fast:     150,
  normal:   250,
  slow:     400,
  verySlow: 600,
} as const;
