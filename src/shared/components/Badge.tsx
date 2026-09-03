/**
 * Shared Component — Badge (theme-aware)
 * @description Indicador de categoria/dificuldade com suporte total a dark/light mode.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { rs } from '../utils/responsive';
import type { LaboratoryCategory, DifficultyLevel } from '../../domain/entities/Laboratory';

// ─── Mapeamentos ──────────────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<LaboratoryCategory, string> = {
  math:        '#3B82F6',
  geography:   '#10B981',
  portuguese:  '#EC4899',
  chemistry:   '#8B5CF6',
  biology:     '#22C55E',
  physics:     '#F59E0B',
  electronics: '#6366F1',
  mechanics:   '#64748B',
};

const CATEGORY_LABELS: Record<LaboratoryCategory, string> = {
  math:        'Matemática',
  geography:   'Geografia',
  portuguese:  'Português',
  chemistry:   'Química',
  biology:     'Biologia',
  physics:     'Física',
  electronics: 'Eletrônica',
  mechanics:   'Mecânica',
};

const DIFFICULTY_COLORS: Record<DifficultyLevel, string> = {
  beginner:     '#10B981',
  intermediate: '#F59E0B',
  advanced:     '#EF4444',
};

const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  beginner:     'Iniciante',
  intermediate: 'Intermediário',
  advanced:     'Avançado',
};

// ─── CategoryBadge ────────────────────────────────────────────────────────────

interface CategoryBadgeProps {
  category: LaboratoryCategory;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  const { theme } = useTheme();
  const color = CATEGORY_COLORS[category];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: `${color}18`,
          borderColor:     `${color}40`,
        },
      ]}
    >
      <Text style={[styles.badgeText, { color }]}>
        {CATEGORY_LABELS[category]}
      </Text>
    </View>
  );
};

// ─── DifficultyBadge ──────────────────────────────────────────────────────────

interface DifficultyBadgeProps {
  level: DifficultyLevel;
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ level }) => {
  const color = DIFFICULTY_COLORS[level];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: `${color}18`,
          borderColor:     `${color}40`,
        },
      ]}
    >
      <Text style={[styles.badgeText, { color }]}>
        {DIFFICULTY_LABELS[level]}
      </Text>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: rs(8),
    paddingVertical:   rs(3),
    borderRadius:      9999,
    borderWidth:       1,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize:      rs(11),
    fontWeight:    '600',
    letterSpacing: 0.3,
  },
});
