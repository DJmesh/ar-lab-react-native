/**
 * Component: Interactive3DViewport
 * @description Motor 3D Interativo de Alta Performance com Renderização Real de Modelos .GLB:
 * - Carrega e renderiza arquivos .GLB originais do Poly Pizza / Kenney / Zoe XR
 * - Rotação livre 360° em X/Y por arrasto de dedo no objeto 3D real
 * - Escala por movimento de pinça (Pinch to Zoom)
 * - Iluminação direcional 3D + Sombra de contato projetada no ambiente real
 */
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { GLBModelViewer, GLBModelKey } from '../../../shared/components/GLBModelViewer';
import { rs } from '../../../shared/utils/responsive';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Interactive3DViewportProps {
  type: 'globe' | 'apple_red' | 'apple_green' | 'generic';
  initialScale?: number;
  label?: string;
  subLabel?: string;
  badgeContent?: React.ReactNode;
  onRotationChange?: (rotYDeg: number) => void;
  onTap?: () => void;
}

export const Interactive3DViewport: React.FC<Interactive3DViewportProps> = ({
  type,
  initialScale = 1.0,
  badgeContent,
  onRotationChange,
}) => {
  const modelKey: GLBModelKey =
    type === 'globe'
      ? 'earth_globe'
      : type === 'apple_red'
      ? 'apple_red'
      : 'apple_green';

  const baseWidth = type === 'globe' ? SCREEN_WIDTH * 0.88 : SCREEN_WIDTH * 0.45;
  const baseHeight = type === 'globe' ? SCREEN_WIDTH * 0.88 : SCREEN_WIDTH * 0.45;

  return (
    <View style={styles.container} pointerEvents="box-none">
      {/* Renderização do Modelo 3D .GLB Real via WebGL PBR Shaders */}
      <View style={[styles.viewport3D, { width: baseWidth, height: baseHeight }]}>
        <GLBModelViewer
          modelKey={modelKey}
          autoRotate={false}
          scale={initialScale}
          onRotationChange={onRotationChange}
        />
      </View>

      {/* Badge ou Informação sobreposta */}
      {badgeContent && (
        <View style={styles.badgeOverlayContainer} pointerEvents="box-none">
          {badgeContent}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  viewport3D: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  badgeOverlayContainer: {
    marginTop: rs(8),
    alignItems: 'center',
  },
});
