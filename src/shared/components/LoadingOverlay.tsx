/**
 * Shared Component — LoadingOverlay (theme-aware + responsive)
 */
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ActivityIndicator } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { rs, rh, rf } from '../utils/responsive';

interface LoadingOverlayProps {
  message?:    string;
  subMessage?: string;
  variant?:    'default' | 'ar' | 'fullscreen';
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  message    = 'Carregando...',
  subMessage,
  variant    = 'default',
}) => {
  const { theme } = useTheme();
  const pulseAnim  = useRef(new Animated.Value(0.6)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim,  { toValue: 1,   duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim,  { toValue: 0.6, duration: 900, useNativeDriver: true }),
      ]),
    ).start();

    Animated.loop(
      Animated.timing(rotateAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
    ).start();
  }, [pulseAnim, rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const c = theme.colors;
  const t = theme.typography;
  const s = theme.spacing;

  if (variant === 'ar') {
    return (
      <View style={styles.arContainer}>
        <Animated.View
          style={[
            styles.arRing,
            { borderColor: c.brand.accent, transform: [{ rotate: spin }] },
          ]}
        />
        <Animated.View style={[styles.arCore, { opacity: pulseAnim }]}>
          <ActivityIndicator size="large" color={c.brand.accent} />
        </Animated.View>
        <Text style={[styles.arMessage, { color: c.brand.accent, fontSize: t.size.md }]}>
          {message}
        </Text>
        {subMessage && (
          <Text style={[styles.arSubMessage, { color: c.text.secondary, fontSize: t.size.sm }]}>
            {subMessage}
          </Text>
        )}
      </View>
    );
  }

  return (
    <View
      style={[
        variant === 'fullscreen'
          ? [styles.fullscreen, { backgroundColor: c.bg.primary }]
          : styles.container,
        { gap: s.md },
      ]}
    >
      <Animated.View style={{ opacity: pulseAnim }}>
        <ActivityIndicator size="large" color={c.brand.accent} />
      </Animated.View>
      <Text style={{ color: c.text.primary, fontSize: t.size.md, fontWeight: '500', textAlign: 'center' }}>
        {message}
      </Text>
      {subMessage && (
        <Text style={{ color: c.text.secondary, fontSize: t.size.sm, textAlign: 'center' }}>
          {subMessage}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding:         rs(32),
    alignItems:      'center',
  },
  fullscreen: {
    flex:            1,
    alignItems:      'center',
    justifyContent:  'center',
  },
  arContainer: {
    alignItems:     'center',
    justifyContent: 'center',
    gap:            rs(12),
  },
  arRing: {
    position:     'absolute',
    width:        rs(80),
    height:       rs(80),
    borderRadius: rs(40),
    borderWidth:  2,
    borderTopColor:    'transparent',
    borderBottomColor: 'transparent',
  },
  arCore: {
    width:          rs(60),
    height:         rs(60),
    alignItems:     'center',
    justifyContent: 'center',
  },
  arMessage: {
    fontWeight:    '600',
    marginTop:     rh(20),
    letterSpacing: 0.5,
  },
  arSubMessage: {
    textAlign: 'center',
    maxWidth:  rs(220),
  },
});
