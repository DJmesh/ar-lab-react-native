/**
 * Shared — Theme Context (Dark / Light)
 *
 * @description Provider de tema com:
 * - Troca em runtime com animação suave (Animated.Value interpolation)
 * - Persistência via AsyncStorage (mantém preferência entre sessões)
 * - Detecção automática do tema do sistema operacional como padrão
 * - Hook `useTheme()` com acesso direto ao objeto de tema atual
 */
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { useColorScheme, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkTheme, lightTheme, type AppTheme } from '../theme/tokens';

// ─────────────────────────────────────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────────────────────────────────────

export type ThemeMode = 'dark' | 'light' | 'system';

interface ThemeContextValue {
  /** Objeto de tema completo com todas as cores, tipografia e espaçamentos */
  theme: AppTheme;
  /** Modo escolhido pelo usuário ('dark' | 'light' | 'system') */
  mode: ThemeMode;
  /** Atalho: true se o tema ativo é escuro */
  isDark: boolean;
  /** Valor animado 0→1 (0 = dark, 1 = light) para interpolações CSS */
  themeProgress: Animated.Value;
  /** Altera o modo de tema e persiste a preferência */
  setMode: (mode: ThemeMode) => void;
  /** Alterna entre dark e light */
  toggleTheme: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTE DE STORAGE
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = '@arlab:theme_mode';

// ─────────────────────────────────────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────────────────────────────────────

const ThemeContext = createContext<ThemeContextValue | null>(null);

// ─────────────────────────────────────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────────────────────────────────────

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('dark');
  const [isLoaded, setIsLoaded] = useState(false);

  // Animated value para interpolações (0 = dark, 1 = light)
  const themeProgress = useRef(new Animated.Value(0)).current;

  // Determina se o tema efetivo é escuro
  const isDark = useMemo<boolean>(() => {
    if (mode === 'system') return systemScheme !== 'light';
    return mode === 'dark';
  }, [mode, systemScheme]);

  // Objeto de tema atual
  const theme = useMemo<AppTheme>(
    () => (isDark ? darkTheme : lightTheme),
    [isDark],
  );

  // ─── Carrega preferência salva ──────────────────────────────────────────

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (saved === 'dark' || saved === 'light' || saved === 'system') {
          setModeState(saved);
        }
      })
      .catch(() => { /* silencia erros de storage */ })
      .finally(() => setIsLoaded(true));
  }, []);

  // ─── Anima a transição entre temas ─────────────────────────────────────

  useEffect(() => {
    if (!isLoaded) return;
    Animated.timing(themeProgress, {
      toValue: isDark ? 0 : 1,
      duration: 350,
      useNativeDriver: false, // backgroundColor não suporta native driver
    }).start();
  }, [isDark, isLoaded, themeProgress]);

  // ─── Setters ────────────────────────────────────────────────────────────

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    AsyncStorage.setItem(STORAGE_KEY, newMode).catch(() => {});
  }, []);

  const toggleTheme = useCallback(() => {
    setMode(isDark ? 'light' : 'dark');
  }, [isDark, setMode]);

  // Não renderiza enquanto carrega preferência salva (evita flash)
  if (!isLoaded) return null;

  return (
    <ThemeContext.Provider
      value={{ theme, mode, isDark, themeProgress, setMode, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Hook para consumir o tema atual em qualquer componente.
 *
 * @example
 * const { theme, isDark, toggleTheme } = useTheme();
 * <View style={{ backgroundColor: theme.colors.bg.primary }} />
 */
export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('[AR Lab] useTheme deve ser usado dentro de <ThemeProvider>');
  }
  return ctx;
};
