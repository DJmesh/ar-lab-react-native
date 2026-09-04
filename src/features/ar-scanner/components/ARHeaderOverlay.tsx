/**
 * Component: ARHeaderOverlay
 * @description Barra superior segura para o scanner RA (Voltar, Título, Status e Pontuação).
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../shared/contexts/ThemeContext';
import { rs } from '../../../shared/utils/responsive';

interface ARHeaderOverlayProps {
  labName: string;
  statusLabel: string;
  statusColor: string;
  score: number;
  topPadding: number;
  onGoBack: () => void;
}

export const ARHeaderOverlay: React.FC<ARHeaderOverlayProps> = ({
  labName,
  statusLabel,
  statusColor,
  score,
  topPadding,
  onGoBack,
}) => {
  const { theme } = useTheme();
  const c = theme.colors;
  const t = theme.typography;

  return (
    <View style={[styles.headerRow, { paddingTop: topPadding }]} pointerEvents="box-none">
      <TouchableOpacity
        style={styles.circleBtn}
        onPress={onGoBack}
        activeOpacity={0.8}
      >
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

      <View style={styles.centerCol}>
        <Text style={styles.labTitle} numberOfLines={1}>
          {labName}
        </Text>
        <View style={styles.statusPill}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={styles.statusText}>{statusLabel}</Text>
        </View>
      </View>

      <View style={[styles.scoreBadge, { backgroundColor: c.brand.primary }]}>
        <Text style={{ color: c.text.onBrand, fontSize: t.size.xs, fontWeight: '800' }}>
          ⭐ {score} PTS
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: rs(16),
    gap: rs(12),
  },
  circleBtn: {
    width: rs(40),
    height: rs(40),
    borderRadius: rs(20),
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    color: '#F9FAFB',
    fontSize: rs(20),
    fontWeight: '600',
  },
  centerCol: {
    flex: 1,
    alignItems: 'center',
    gap: rs(2),
  },
  labTitle: {
    color: '#F9FAFB',
    fontSize: rs(15),
    fontWeight: '700',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs(6),
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: rs(10),
    paddingVertical: rs(3),
    borderRadius: 9999,
  },
  statusDot: {
    width: rs(8),
    height: rs(8),
    borderRadius: rs(4),
  },
  statusText: {
    color: '#E5E7EB',
    fontSize: rs(11),
    fontWeight: '600',
  },
  scoreBadge: {
    paddingHorizontal: rs(12),
    paddingVertical: rs(6),
    borderRadius: rs(16),
  },
});
