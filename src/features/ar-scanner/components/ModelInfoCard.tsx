/**
 * Feature: AR Scanner — ModelInfoCard (theme-aware + responsive)
 */
import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, TouchableOpacity, ScrollView,
} from 'react-native';
import { useTheme } from '../../../shared/contexts/ThemeContext';
import { rs, rw, rh } from '../../../shared/utils/responsive';
import type { ARModel } from '../../../domain/entities/ARSession';

interface ModelInfoCardProps {
  model:     ARModel;
  onDismiss: () => void;
}

const TYPE_EMOJI: Record<string, string> = {
  molecule:  '⚗️',
  equipment: '🔬',
  anatomy:   '🧬',
  geometry:  '📐',
  circuit:   '⚡',
};

export const ModelInfoCard: React.FC<ModelInfoCardProps> = ({ model, onDismiss }) => {
  const { theme } = useTheme();
  const slideAnim   = useRef(new Animated.Value(300)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const c = theme.colors;
  const t = theme.typography;
  const s = theme.spacing;
  const r = theme.radius;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim,  { toValue: 0, tension: 65, friction: 11, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  const dismiss = () => {
    Animated.parallel([
      Animated.timing(slideAnim,   { toValue: 300, duration: 250, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 0,   duration: 200, useNativeDriver: true }),
    ]).start(() => onDismiss());
  };

  return (
    <Animated.View
      style={[
        styles.card,
        theme.shadows.card,
        {
          backgroundColor:     c.bg.secondary,
          borderTopLeftRadius: r['2xl'],
          borderTopRightRadius: r['2xl'],
          borderTopWidth:      1,
          borderTopColor:      c.border.accent,
          transform:           [{ translateY: slideAnim }],
          opacity:             opacityAnim,
        },
      ]}
    >
      {/* Handle */}
      <View style={[styles.handle, { backgroundColor: c.border.medium }]} />

      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: s.base, paddingBottom: s.md }]}>
        <View style={styles.headerLeft}>
          <Text style={{ fontSize: rs(36) }}>{TYPE_EMOJI[model.type] ?? '🔬'}</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ color: c.text.primary, fontSize: t.size.lg, fontWeight: '700' }}>
              {model.name}
            </Text>
            <Text style={{ color: c.brand.accent, fontSize: t.size.xs, fontWeight: '600', letterSpacing: 1.2, marginTop: rs(2) }}>
              {model.type.toUpperCase()}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={dismiss}
          style={[styles.closeBtn, { backgroundColor: c.bg.tertiary }]}
          activeOpacity={0.7}
        >
          <Text style={{ color: c.text.secondary, fontSize: rs(14), fontWeight: '600' }}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.divider, { backgroundColor: c.border.subtle, marginHorizontal: s.base }]} />

      <ScrollView showsVerticalScrollIndicator={false} style={{ padding: s.base }}>
        <Text style={{ color: c.text.secondary, fontSize: t.size.base, lineHeight: t.size.base * 1.5, marginBottom: s.base }}>
          {model.description}
        </Text>

        <Text style={{ color: c.text.tertiary, fontSize: t.size.xs, fontWeight: '600', letterSpacing: 0.8, marginBottom: s.sm, textTransform: 'uppercase' }}>
          Temas relacionados
        </Text>

        <View style={[styles.tagsRow, { marginBottom: s.base }]}>
          {model.educationalTags.map((tag) => (
            <View key={tag} style={[styles.tag, { backgroundColor: c.bg.tertiary, borderColor: c.border.subtle }]}>
              <Text style={{ color: c.brand.accent, fontSize: t.size.xs }}>#{tag}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.tipBox, { backgroundColor: c.bg.tertiary, borderRadius: r.md, padding: s.md, marginBottom: rh(40) }]}>
          <Text style={{ fontSize: rs(16) }}>💡</Text>
          <Text style={{ color: c.text.secondary, fontSize: t.size.sm, flex: 1, lineHeight: t.size.sm * 1.6 }}>
            Mova o dispositivo ao redor do modelo para explorá-lo em 3D. Use dois dedos para ampliar.
          </Text>
        </View>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    maxHeight: rh(380),
    paddingTop: rs(8),
  },
  handle: {
    width: rs(40), height: rs(4),
    borderRadius: 9999,
    alignSelf: 'center',
    marginBottom: rs(12),
  },
  header: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           rs(12),
    flex:          1,
  },
  closeBtn: {
    width: rs(32), height: rs(32),
    borderRadius: rs(16),
    alignItems:     'center',
    justifyContent: 'center',
  },
  divider: { height: 1 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: rs(8) },
  tag: {
    paddingHorizontal: rs(8),
    paddingVertical:   rs(3),
    borderRadius:      9999,
    borderWidth:       1,
  },
  tipBox: { flexDirection: 'row', gap: rs(8) },
});
