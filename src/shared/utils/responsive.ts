/**
 * Shared — Responsive Utilities
 *
 * @description Sistema de escala responsiva baseado no design de referência (375x812).
 * Garante que fontes, espaçamentos e tamanhos se adaptem a qualquer dispositivo.
 *
 * Inspired by: react-native-size-matters pattern
 */
import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/** Resolução de referência: iPhone 14 (375 × 812) */
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

/**
 * Escala horizontal — ideal para larguras, padding horizontal, tamanhos de ícones.
 * @example rw(16) → 16px em 375px, proporcional em outras larguras
 */
export const rw = (size: number): number => {
  return (SCREEN_WIDTH / BASE_WIDTH) * size;
};

/**
 * Escala vertical — ideal para alturas, padding vertical, margens.
 * @example rh(24) → 24px em 812px, proporcional em outras alturas
 */
export const rh = (size: number): number => {
  return (SCREEN_HEIGHT / BASE_HEIGHT) * size;
};

/**
 * Escala moderada — balanceia horizontal e vertical.
 * Ideal para fontes e elementos que não devem crescer demais em telas grandes.
 * @param factor 0 = sem escala, 1 = escala total (padrão: 0.5)
 */
export const rs = (size: number, factor = 0.5): number => {
  return size + (rw(size) - size) * factor;
};

/**
 * Escala de fonte — usa PixelRatio para máxima nitidez.
 */
export const rf = (size: number): number => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

/** Largura atual da tela */
export const screenWidth = SCREEN_WIDTH;

/** Altura atual da tela */
export const screenHeight = SCREEN_HEIGHT;

/** Detecta tablet (largura >= 600dp) */
export const isTablet = SCREEN_WIDTH >= 600;

/** Detecta tela pequena (largura <= 320dp) */
export const isSmallScreen = SCREEN_WIDTH <= 320;

/** Detecta tela grande (largura >= 428dp — iPhone Pro Max, etc.) */
export const isLargeScreen = SCREEN_WIDTH >= 428;

/**
 * Retorna valor condicional baseado no tipo de tela.
 */
export const responsive = <T>(options: {
  small?: T;
  default: T;
  large?: T;
  tablet?: T;
}): T => {
  if (isTablet && options.tablet !== undefined) return options.tablet;
  if (isLargeScreen && options.large !== undefined) return options.large;
  if (isSmallScreen && options.small !== undefined) return options.small;
  return options.default;
};
