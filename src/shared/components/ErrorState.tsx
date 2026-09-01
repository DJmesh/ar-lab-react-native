/**
 * Shared Component — ErrorState (theme-aware + responsive)
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { rs, rf } from '../utils/responsive';

interface ErrorStateProps {
  title?:       string;
  message:      string;
  actionLabel?: string;
  onAction?:    () => void;
  icon?:        string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title       = 'Ops! Algo deu errado',
  message,
  actionLabel = 'Tentar novamente',
  onAction,
  icon        = '⚠️',
}) => {
  const { theme } = useTheme();
  const c = theme.colors;
  const t = theme.typography;
  const s = theme.spacing;
  const r = theme.radius;

  return (
    <View style={[styles.container, { padding: s['3xl'] }]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.title, { color: c.text.primary, fontSize: t.size.lg }]}>
        {title}
      </Text>
      <Text
        style={[
          styles.message,
          { color: c.text.secondary, fontSize: t.size.base, lineHeight: t.size.base * 1.5 },
        ]}
      >
        {message}
      </Text>
      {onAction && (
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: c.brand.primary, borderRadius: r.lg, marginTop: s.md },
          ]}
          onPress={onAction}
          activeOpacity={0.8}
        >
          <Text style={[styles.buttonText, { color: c.text.onBrand, fontSize: t.size.base }]}>
            {actionLabel}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
    gap:            rs(12),
  },
  icon: {
    fontSize:     rs(56),
    marginBottom: rs(8),
  },
  title: {
    fontWeight:  '700',
    textAlign:   'center',
  },
  message: {
    textAlign: 'center',
    maxWidth:  rs(280),
  },
  button: {
    paddingHorizontal: rs(32),
    paddingVertical:   rs(12),
  },
  buttonText: {
    fontWeight: '600',
  },
});
