/**
 * Component: ARCameraView
 * @description Encapsula o feed nativo de câmera do Expo com fallback de permissão.
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CameraView, PermissionResponse } from 'expo-camera';
import { useTheme } from '../../../shared/contexts/ThemeContext';
import { rs } from '../../../shared/utils/responsive';

interface ARCameraViewProps {
  permission: PermissionResponse | null;
  onRequestPermission: () => void;
}

export const ARCameraView: React.FC<ARCameraViewProps> = ({
  permission,
  onRequestPermission,
}) => {
  const { theme, isDark } = useTheme();
  const c = theme.colors;
  const t = theme.typography;

  if (permission?.granted) {
    return <CameraView style={StyleSheet.absoluteFillObject} facing="back" />;
  }

  return (
    <View style={[styles.fallbackContainer, { backgroundColor: isDark ? '#050810' : '#0F172A' }]}>
      <Text style={{ fontSize: rs(48), marginBottom: rs(12) }}>📷</Text>
      <Text style={{ color: '#F9FAFB', fontSize: t.size.base, fontWeight: '700', textAlign: 'center' }}>
        Permissão de Câmera Necessária
      </Text>
      <Text style={{ color: '#9CA3AF', fontSize: t.size.xs, textAlign: 'center', marginVertical: rs(8), paddingHorizontal: rs(24) }}>
        Para interagir com o mundo 3D em Realidade Aumentada estilo Pokémon GO, libere o acesso à câmera.
      </Text>
      <TouchableOpacity
        style={[styles.grantBtn, { backgroundColor: c.brand.primary }]}
        onPress={onRequestPermission}
        activeOpacity={0.8}
      >
        <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: t.size.sm }}>
          Ativar Câmera 📸
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  fallbackContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grantBtn: {
    paddingHorizontal: rs(20),
    paddingVertical: rs(10),
    borderRadius: rs(20),
    marginTop: rs(12),
  },
});
