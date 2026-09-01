/**
 * Feature: Laboratory — LabCard (theme-aware + responsive)
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CategoryBadge, DifficultyBadge } from '../../../shared/components/Badge';
import { useTheme } from '../../../shared/contexts/ThemeContext';
import { rs, rw, screenWidth } from '../../../shared/utils/responsive';
import type { Laboratory } from '../../../domain/entities/Laboratory';

const CARD_WIDTH = screenWidth * 0.88;

const CATEGORY_ICONS: Record<string, string> = {
  chemistry:   '⚗️',
  biology:     '🧬',
  physics:     '⚡',
  electronics: '🔌',
  mechanics:   '⚙️',
};

interface LabCardProps {
  lab:       Laboratory;
  onPress:   (lab: Laboratory) => void;
  onARPress: (lab: Laboratory) => void;
}

export const LabCard: React.FC<LabCardProps> = ({ lab, onPress, onARPress }) => {
  const { theme } = useTheme();
  const c = theme.colors;
  const t = theme.typography;
  const s = theme.spacing;
  const r = theme.radius;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        theme.shadows.card,
        {
          backgroundColor: c.bg.secondary,
          borderRadius:    r['2xl'],
          borderColor:     c.border.subtle,
          marginBottom:    s.base,
        },
      ]}
      onPress={() => onPress(lab)}
      activeOpacity={0.85}
    >
      {/* Barra decorativa de topo */}
      <View style={[styles.topBar, { backgroundColor: c.brand.accent }]} />

      {/* Ícone flutuante */}
      <View
        style={[
          styles.iconArea,
          {
            backgroundColor: c.bg.tertiary,
            borderColor:     c.border.medium,
            borderRadius:    rs(28),
          },
        ]}
      >
        <Text style={{ fontSize: rs(28) }}>
          {CATEGORY_ICONS[lab.category] ?? '🔬'}
        </Text>
      </View>

      {/* Conteúdo */}
      <View style={[styles.content, { padding: s.base, paddingTop: s.md, gap: s.sm }]}>
        <View style={[styles.badgeRow, { gap: s.sm }]}>
          <CategoryBadge category={lab.category} />
          <DifficultyBadge level={lab.difficulty} />
        </View>

        <Text
          style={{
            color:        c.text.primary,
            fontSize:     t.size.md,
            fontWeight:   '700',
            letterSpacing: -0.3,
            paddingRight: rs(64),
          }}
        >
          {lab.name}
        </Text>

        <Text
          style={{
            color:       c.text.secondary,
            fontSize:    t.size.sm,
            lineHeight:  t.size.sm * 1.55,
            paddingRight: rs(20),
          }}
          numberOfLines={2}
        >
          {lab.description}
        </Text>

        {/* Footer */}
        <View
          style={[
            styles.footer,
            {
              marginTop:      s.sm,
              paddingTop:     s.sm,
              borderTopWidth: 1,
              borderTopColor: c.border.subtle,
            },
          ]}
        >
          <View style={styles.durationBadge}>
            <Text style={{ fontSize: rs(13) }}>⏱</Text>
            <Text style={{ color: c.text.tertiary, fontSize: t.size.sm }}>
              {lab.estimatedDuration} min
            </Text>
          </View>

          {lab.arMarkerId && (
            <TouchableOpacity
              style={[
                styles.arButton,
                {
                  backgroundColor: c.brand.glow,
                  borderColor:     c.border.accent,
                  borderRadius:    r.full,
                  paddingHorizontal: s.md,
                  paddingVertical:   s.xs,
                  gap:             s.xs,
                },
              ]}
              onPress={() => onARPress(lab)}
              activeOpacity={0.8}
            >
              <Text style={{ fontSize: rs(14) }}>🔮</Text>
              <Text style={{ color: c.brand.accent, fontSize: t.size.sm, fontWeight: '600' }}>
                Abrir em RA
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width:    CARD_WIDTH,
    overflow: 'hidden',
    borderWidth: 1,
  },
  topBar: {
    height:  rs(3),
    opacity: 0.7,
  },
  iconArea: {
    position:       'absolute',
    top:            rs(12),
    right:          rs(16),
    width:          rs(56),
    height:         rs(56),
    alignItems:     'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  content:    {},
  badgeRow:   { flexDirection: 'row' },
  footer:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  durationBadge: { flexDirection: 'row', alignItems: 'center', gap: rs(4) },
  arButton:   { flexDirection: 'row', alignItems: 'center', borderWidth: 1 },
});
