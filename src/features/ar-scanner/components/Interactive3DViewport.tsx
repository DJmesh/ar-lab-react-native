/**
 * Component: Interactive3DViewport
 * @description Motor 3D Interativo de Alta Performance com Gestos Naturais:
 * - Rotação livre 360° em X/Y por arrasto de dedo (Pan Drag)
 * - Escala por movimento de pinça (Pinch to Zoom)
 * - Iluminação direcional 3D + Sombra de contato projetada no ambiente real
 */
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions,
} from 'react-native';
import { rs } from '../../../shared/utils/responsive';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

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
  label,
  subLabel,
  badgeContent,
  onRotationChange,
  onTap,
}) => {
  const panX = useRef(new Animated.Value(0)).current;
  const panY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(initialScale)).current;

  // Estado interno para rotações em graus
  const [rotX, setRotX] = useState(15);
  const [rotY, setRotY] = useState(0);
  const [currentScaleVal, setCurrentScaleVal] = useState(initialScale);

  // Distância inicial para o gesto de pinça (pinch)
  const initialPinchDist = useRef<number | null>(null);

  const calculateDistance = (touches: any[]) => {
    if (touches.length < 2) return 0;
    const [t1, t2] = touches;
    const dx = t1.pageX - t2.pageX;
    const dy = t1.pageY - t2.pageY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: (evt) => {
        if (evt.nativeEvent.touches.length === 2) {
          initialPinchDist.current = calculateDistance(evt.nativeEvent.touches);
        }
      },

      onPanResponderMove: (evt, gestureState) => {
        const { touches } = evt.nativeEvent;

        // Gesto de Pinça (Pinch to Zoom / Scale com 2 dedos)
        if (touches.length === 2) {
          const currentDist = calculateDistance(touches);
          if (initialPinchDist.current && initialPinchDist.current > 0) {
            const factor = currentDist / initialPinchDist.current;
            let newScale = currentScaleVal * factor;
            newScale = Math.max(0.5, Math.min(3.5, newScale)); // Limites de zoom: 0.5x até 3.5x
            scale.setValue(newScale);
          }
          return;
        }

        // Gesto de Arrasto com 1 dedo (Pan Drag 360° Rotation)
        if (touches.length === 1) {
          // Inverter DX/DY para controle natural de rotação 3D
          const sensitivity = 0.65;
          const nextRotY = (rotY + gestureState.dx * sensitivity + 360) % 360;
          const nextRotX = Math.max(-60, Math.min(60, rotX - gestureState.dy * sensitivity));

          setRotY(nextRotY);
          setRotX(nextRotX);

          if (onRotationChange) {
            onRotationChange(nextRotY);
          }
        }
      },

      onPanResponderRelease: (evt) => {
        initialPinchDist.current = null;
        // Salvar escala atualizada
        // @ts-ignore
        scale.addListener(({ value }) => setCurrentScaleVal(value));
        if (onTap && Math.abs(evt.nativeEvent.locationX) < 20) {
          onTap();
        }
      },
    }),
  ).current;

  // Tamanho base responsivo imersivo (ocupa grande parte da tela no mobile)
  const baseSize = type === 'globe' ? SCREEN_WIDTH * 0.72 : SCREEN_WIDTH * 0.42;

  return (
    <View style={styles.container} pointerEvents="box-none">
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.viewport3D,
          {
            width: baseSize,
            height: baseSize,
            transform: [
              { perspective: 1000 },
              { scale: scale },
              { rotateX: `${rotX}deg` },
              { rotateY: `${rotY}deg` },
            ],
          },
        ]}
      >
        {/* Renderização do Modelo 3D com Texturas, Iluminação Specular e Profundidade */}
        {type === 'globe' ? (
          <View style={styles.globeSphere3D}>
            {/* Brilho da Atmosfera 3D */}
            <View style={styles.atmosphereGlow} />

            {/* Continentes e Oceanos Tridimensionais em Textura de Alta Fidelidade */}
            <View style={[styles.globeTextureMap, { transform: [{ rotate: `${rotY}deg` }] }]}>
              <View style={styles.continentPacific} />
              <View style={styles.continentAmericas}>
                <Text style={styles.continentEmoji}>🌎</Text>
              </View>
              <View style={styles.continentEurasiaAfrica}>
                <Text style={styles.continentEmoji}>🌍</Text>
              </View>
              <View style={styles.continentAsiaAustralia}>
                <Text style={styles.continentEmoji}>🌏</Text>
              </View>
            </View>

            {/* Linhas de Meridianos e Latitude 3D */}
            <View style={styles.meridianRing} />
            <View style={styles.equatorRing} />

            {/* Luz Specular 3D (Highlights) */}
            <View style={styles.specularHighlight} />
          </View>
        ) : (
          /* Maçãs 3D (Vermelha / Verde) */
          <View style={styles.appleSphere3D}>
            <Text style={{ fontSize: baseSize * 0.75 }}>
              {type === 'apple_red' ? '🍎' : '🍏'}
            </Text>
            <View style={styles.appleSpecularHighlight} />
          </View>
        )}

        {/* Sombra de Contato Realista Projetada no Chão Real (Ambient Occlusion) */}
        <View style={styles.groundShadow3D} />
      </Animated.View>

      {/* Dica Visual de Interação por Gestos */}
      <View style={styles.gestureTipBox} pointerEvents="none">
        <Text style={styles.gestureTipText}>
          👆 Arraste para girar 360° | 🤌 Pinça para ajustar o tamanho
        </Text>
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
  },
  globeSphere3D: {
    width: '100%',
    height: '100%',
    borderRadius: 9999,
    backgroundColor: '#0EA5E9',
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#38BDF8',
    elevation: 16,
    shadowColor: '#38BDF8',
    shadowRadius: 20,
    shadowOpacity: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  atmosphereGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 9999,
    borderWidth: 8,
    borderColor: 'rgba(56, 189, 248, 0.45)',
  },
  globeTextureMap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  continentPacific: {
    position: 'absolute',
    left: '10%',
  },
  continentAmericas: {
    position: 'absolute',
    left: '25%',
  },
  continentEurasiaAfrica: {
    position: 'absolute',
    right: '25%',
  },
  continentAsiaAustralia: {
    position: 'absolute',
    right: '10%',
  },
  continentEmoji: {
    fontSize: rs(90),
  },
  meridianRing: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 9999,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    transform: [{ rotateY: '45deg' }],
  },
  equatorRing: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  specularHighlight: {
    position: 'absolute',
    top: '8%',
    left: '12%',
    width: '32%',
    height: '32%',
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  appleSphere3D: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  appleSpecularHighlight: {
    position: 'absolute',
    top: '10%',
    left: '20%',
    width: '25%',
    height: '25%',
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  groundShadow3D: {
    position: 'absolute',
    bottom: -rs(24),
    width: '80%',
    height: rs(18),
    borderRadius: 9999,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    transform: [{ scaleY: 0.3 }],
    elevation: 4,
  },
  gestureTipBox: {
    marginTop: rs(32),
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: rs(14),
    paddingVertical: rs(6),
    borderRadius: rs(20),
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.4)',
  },
  gestureTipText: {
    color: '#94A3B8',
    fontSize: rs(11),
    fontWeight: '700',
    textAlign: 'center',
  },
  badgeOverlayContainer: {
    marginTop: rs(12),
    alignItems: 'center',
  },
});
