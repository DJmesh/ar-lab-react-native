/**
 * Shared — Theme Toggle Button
 *
 * @description Botão compacto de alternância entre dark/light mode.
 * Usa Animated.Value para interpolar cores e posição do ícone.
 * Pode ser usado em headers, configurações ou qualquer lugar da UI.
 */
import React, { useEffect, useRef } from 'react';
import {
  TouchableOpacity,
  Animated,
  StyleSheet,
  View,
  AccessibilityInfo,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { rs, rw } from '../utils/responsive';

const TOGGLE_WIDTH  = rw(56);
const TOGGLE_HEIGHT = rw(30);
const KNOB_SIZE     = rw(22);
const KNOB_MARGIN   = (TOGGLE_HEIGHT - KNOB_SIZE) / 2;
const KNOB_TRAVEL   = TOGGLE_WIDTH - KNOB_SIZE - KNOB_MARGIN * 2;

export const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme, themeProgress } = useTheme();

  // Posição do knob: 0 (dark = esquerda) → KNOB_TRAVEL (light = direita)
  const knobX = themeProgress.interpolate({
    inputRange:  [0, 1],
    outputRange: [KNOB_MARGIN, KNOB_MARGIN + KNOB_TRAVEL],
  });

  // Cor de fundo da trilha
  const trackColor = themeProgress.interpolate({
    inputRange:  [0, 1],
    outputRange: ['#1C2537', '#BAE6FD'],
  });

  // Cor do knob
  const knobColor = themeProgress.interpolate({
    inputRange:  [0, 1],
    outputRange: ['#22D3EE', '#0891B2'],
  });

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      activeOpacity={0.85}
      accessible
      accessibilityRole="switch"
      accessibilityState={{ checked: !isDark }}
      accessibilityLabel={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Animated.View
        style={[
          styles.track,
          {
            backgroundColor: trackColor,
            borderColor: themeProgress.interpolate({
              inputRange:  [0, 1],
              outputRange: ['rgba(34,211,238,0.3)', 'rgba(8,145,178,0.4)'],
            }),
          },
        ]}
      >
        {/* Ícone do tema (posicionado nas extremidades) */}
        <View style={styles.iconLeft}>
          <Animated.Text
            style={[
              styles.icon,
              {
                opacity: themeProgress.interpolate({
                  inputRange: [0, 0.5],
                  outputRange: [1, 0],
                  extrapolate: 'clamp',
                }),
              },
            ]}
          >
            🌙
          </Animated.Text>
        </View>
        <View style={styles.iconRight}>
          <Animated.Text
            style={[
              styles.icon,
              {
                opacity: themeProgress.interpolate({
                  inputRange: [0.5, 1],
                  outputRange: [0, 1],
                  extrapolate: 'clamp',
                }),
              },
            ]}
          >
            ☀️
          </Animated.Text>
        </View>

        {/* Knob deslizante */}
        <Animated.View
          style={[
            styles.knob,
            {
              transform: [{ translateX: knobX }],
              backgroundColor: knobColor,
            },
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  track: {
    width:        TOGGLE_WIDTH,
    height:       TOGGLE_HEIGHT,
    borderRadius: TOGGLE_HEIGHT / 2,
    borderWidth:  1,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  knob: {
    position:     'absolute',
    width:        KNOB_SIZE,
    height:       KNOB_SIZE,
    borderRadius: KNOB_SIZE / 2,
    top:          KNOB_MARGIN,
    shadowColor:  '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius:  3,
    elevation:    3,
  },
  iconLeft: {
    position: 'absolute',
    left: KNOB_MARGIN + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconRight: {
    position: 'absolute',
    right: KNOB_MARGIN + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: rs(11),
  },
});
