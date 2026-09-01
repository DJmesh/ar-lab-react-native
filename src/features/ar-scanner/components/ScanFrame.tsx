/**
 * Feature: AR Scanner — ScanFrame (theme-aware + responsive)
 */
import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../../../shared/contexts/ThemeContext';
import { rw, rh, rs } from '../../../shared/utils/responsive';

const FRAME_SIZE        = rw(268);
const CORNER_SIZE       = rs(28);
const CORNER_THICKNESS  = rs(3);

interface ScanFrameProps {
  isScanning: boolean;
  isDetected: boolean;
}

export const ScanFrame: React.FC<ScanFrameProps> = ({ isScanning, isDetected }) => {
  const { theme } = useTheme();
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim    = useRef(new Animated.Value(1)).current;
  const glowOpacity  = useRef(new Animated.Value(0.4)).current;

  const frameColor = isDetected
    ? theme.colors.semantic.success
    : theme.colors.brand.accent;

  useEffect(() => {
    if (isScanning) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanLineAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
          Animated.timing(scanLineAnim, { toValue: 0, duration: 0,    useNativeDriver: true }),
        ]),
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(glowOpacity, { toValue: 0.85, duration: 900, useNativeDriver: true }),
          Animated.timing(glowOpacity, { toValue: 0.25, duration: 900, useNativeDriver: true }),
        ]),
      ).start();
    } else {
      scanLineAnim.stopAnimation();
    }
  }, [isScanning, scanLineAnim, glowOpacity]);

  useEffect(() => {
    if (isDetected) {
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.09, duration: 180, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.96, duration: 130, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1.00, duration: 130, useNativeDriver: true }),
      ]).start();
    }
  }, [isDetected, pulseAnim]);

  const scanLineY = scanLineAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: [0, FRAME_SIZE],
  });

  return (
    <Animated.View style={[styles.frame, { transform: [{ scale: pulseAnim }] }]}>
      {/* Cantos */}
      {(['topLeft', 'topRight', 'bottomLeft', 'bottomRight'] as const).map((corner) => (
        <View
          key={corner}
          style={[styles.corner, styles[corner], { borderColor: frameColor }]}
        />
      ))}

      {/* Linha de varredura */}
      {isScanning && !isDetected && (
        <Animated.View
          style={[
            styles.scanLine,
            {
              backgroundColor: frameColor,
              opacity:         glowOpacity,
              shadowColor:     frameColor,
              transform:       [{ translateY: scanLineY }],
            },
          ]}
        />
      )}

      {/* Overlay de confirmação */}
      {isDetected && (
        <Animated.View
          style={[
            styles.detectedOverlay,
            {
              opacity:         glowOpacity,
              backgroundColor: `${theme.colors.semantic.success}08`,
            },
          ]}
        >
          <View style={[styles.checkCircle, { borderColor: theme.colors.semantic.success }]} />
        </Animated.View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  frame: {
    width:    FRAME_SIZE,
    height:   FRAME_SIZE,
    alignSelf: 'center',
    overflow:  'hidden',
  },
  corner: {
    position: 'absolute',
    width:    CORNER_SIZE,
    height:   CORNER_SIZE,
  },
  topLeft: {
    top: 0, left: 0,
    borderTopWidth: CORNER_THICKNESS, borderLeftWidth: CORNER_THICKNESS,
    borderTopLeftRadius: rs(4),
  },
  topRight: {
    top: 0, right: 0,
    borderTopWidth: CORNER_THICKNESS, borderRightWidth: CORNER_THICKNESS,
    borderTopRightRadius: rs(4),
  },
  bottomLeft: {
    bottom: 0, left: 0,
    borderBottomWidth: CORNER_THICKNESS, borderLeftWidth: CORNER_THICKNESS,
    borderBottomLeftRadius: rs(4),
  },
  bottomRight: {
    bottom: 0, right: 0,
    borderBottomWidth: CORNER_THICKNESS, borderRightWidth: CORNER_THICKNESS,
    borderBottomRightRadius: rs(4),
  },
  scanLine: {
    position: 'absolute',
    left: 0, right: 0,
    height:       rs(2),
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius:  6,
    elevation:     8,
  },
  detectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems:     'center',
    justifyContent: 'center',
  },
  checkCircle: {
    width:        rs(48),
    height:       rs(48),
    borderRadius: rs(24),
    borderWidth:  rs(2),
  },
});
