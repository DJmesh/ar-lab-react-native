/**
 * AR-Lab Mobile — Root Application Component
 *
 * @description Componente raiz com NavigationContainer que consome
 * o tema dinâmico do ThemeContext para atualizar a navegação em tempo real.
 */
import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

import { RootNavigator } from './src/navigation/RootNavigator';
import { ThemeProvider, useTheme } from './src/shared/contexts/ThemeContext';
import { buildNavigationTheme } from './src/shared/theme/navigationTheme';

/**
 * Inner component que acessa o ThemeContext para repassar ao NavigationContainer.
 * Necessário porque NavigationContainer precisa estar fora do ThemeProvider
 * mas consumir o tema via hook.
 */
const ThemedApp: React.FC = () => {
  const { theme, isDark } = useTheme();
  const navTheme = buildNavigationTheme(theme);

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.bg.primary}
      />
      <RootNavigator />
    </NavigationContainer>
  );
};

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ThemedApp />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({ root: { flex: 1 } });

export default App;
