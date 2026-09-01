/**
 * Feature: AR Scanner — ScanTipOverlay (theme-aware + responsive)
 */
import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../../shared/contexts/ThemeContext';
import { rs, rw, rh, screenWidth } from '../../../shared/utils/responsive';

interface ScanTipOverlayProps {
  onDismiss: () => void;
}

const TIPS = [
  { icon: '💡', text: 'Mantenha boa iluminação no ambiente' },
  { icon: '📏', text: 'Distância ideal: 20 a 50 cm do marcador' },
  { icon: '🔄', text: 'Mantenha o dispositivo estável' },
] as const;

export const ScanTipOverlay: React.FC<ScanTipOverlayProps> = ({ onDismiss }) => {
  const { theme } = useTheme();
  const fadeAnim   = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  const c = theme.colors;
  const t = theme.typography;
  const s = theme.spacing;
  const r = theme.radius;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, { toValue: -rh(8), duration: 700, useNativeDriver: true }),
          Animated.timing(bounceAnim, { toValue: 0,       duration: 700, useNativeDriver: true }),
        ]),
      ),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={[styles.backdrop, { backgroundColor: theme.isDark ? 'rgba(10,14,26,0.90)' : 'rgba(240,244,255,0.92)' }]} />
      <View
        style={[
          styles.content,
          {
            width:           screenWidth * 0.88,
            backgroundColor: c.bg.secondary,
            borderRadius:    r['2xl'],
            borderColor:     c.border.accent,
            padding:         s['2xl'],
          },
        ]}
      >
        <Animated.Text style={[styles.phoneIcon, { transform: [{ translateY: bounceAnim }] }]}>
          📱
        </Animated.Text>

        <Text style={{ color: c.text.primary, fontSize: t.size.xl, fontWeight: '700', textAlign: 'center' }}>
          Aponte para o marcador
        </Text>
        <Text style={{ color: c.text.secondary, fontSize: t.size.base, textAlign: 'center', lineHeight: t.size.base * 1.5 }}>
          Encontre o marcador impresso no roteiro de laboratório e aponte a câmera para ele até o modelo 3D aparecer.
        </Text>

        <View style={[styles.tipsContainer, { gap: s.sm }]}>
          {TIPS.map(({ icon, text }) => (
            <View
              key={text}
              style={[
                styles.tipRow,
                { backgroundColor: c.bg.tertiary, borderRadius: r.md, padding: s.md, gap: s.sm },
              ]}
            >
              <Text style={{ fontSize: rs(16) }}>{icon}</Text>
              <Text style={{ color: c.text.secondary, fontSize: t.size.sm, flex: 1, lineHeight: t.size.sm * 1.6 }}>
                {text}
              </Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: c.brand.primary, borderRadius: r.lg, paddingVertical: s.md, marginTop: s.sm },
          ]}
          onPress={onDismiss}
          activeOpacity={0.85}
        >
          <Text style={{ color: c.text.onBrand, fontSize: t.size.base, fontWeight: '700' }}>
            Entendido — Iniciar varredura
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems:     'center',
    justifyContent: 'center',
    zIndex:         100,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    alignItems: 'center',
    borderWidth: 1,
    gap: rs(12),
  },
  phoneIcon: {
    fontSize:     rs(56),
    marginBottom: rs(8),
  },
  tipsContainer: {
    width: '100%',
  },
  tipRow: {
    flexDirection: 'row',
    alignItems:    'flex-start',
  },
  button: {
    width:      '100%',
    alignItems: 'center',
  },
});
