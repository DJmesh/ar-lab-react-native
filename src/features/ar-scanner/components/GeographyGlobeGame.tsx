/**
 * Component: GeographyGlobeGame
 * @description Módulo de Geografia Infantil — Gincana dos Continentes com Globo 3D Imersivo:
 * - Rotação fluida 360° em X/Y por arrasto gestual na tela
 * - Zoom por gesto de pinça com 2 dedos (Pinch-to-Scale)
 * - Iluminação 3D + Sombra de contato no plano da câmera
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Interactive3DViewport } from './Interactive3DViewport';
import { rs } from '../../../shared/utils/responsive';

export interface ContinentInfo {
  id: string;
  name: string;
  flag: string;
  mascot: string;
  minDegree: number;
  maxDegree: number;
}

const CONTINENTS: ContinentInfo[] = [
  { id: 'south_america', name: 'América do Sul', flag: '🇧🇷', mascot: 'Arara Azul 🦜', minDegree: 0,   maxDegree: 60 },
  { id: 'north_america', name: 'América do Norte', flag: '🇺🇸', mascot: 'Urso Pardo 🐻', minDegree: 60,  maxDegree: 135 },
  { id: 'asia_oceania',  name: 'Ásia & Oceania',   flag: '🇨🇳', mascot: 'Urso Panda 🐼', minDegree: 135, maxDegree: 210 },
  { id: 'africa',        name: 'África',          flag: '🇿🇦', mascot: 'Leão 🦁',        minDegree: 210, maxDegree: 280 },
  { id: 'europe',        name: 'Europa',          flag: '🇪🇺', mascot: 'Águia Real 🦅',  minDegree: 280, maxDegree: 360 },
];

interface GeographyGlobeGameProps {
  onScorePoints: (pts: number) => void;
  onShowMessage: (msg: string) => void;
}

export const GeographyGlobeGame: React.FC<GeographyGlobeGameProps> = ({
  onScorePoints,
  onShowMessage,
}) => {
  const [globeRotationY, setGlobeRotationY] = useState(0);
  const [targetContinentIdx, setTargetContinentIdx] = useState(3); // Começa com África

  const getCurrentContinent = (deg: number): ContinentInfo => {
    const normalizedDeg = ((deg % 360) + 360) % 360;
    return (
      CONTINENTS.find(
        (cont) => normalizedDeg >= cont.minDegree && normalizedDeg < cont.maxDegree,
      ) ?? CONTINENTS[0]
    );
  };

  const currentVisibleContinent = getCurrentContinent(globeRotationY);
  const targetContinent = CONTINENTS[targetContinentIdx];

  const handleRotationChange = (newRotYDeg: number) => {
    setGlobeRotationY(newRotYDeg);
  };

  const handleCheckGeoChallenge = () => {
    if (currentVisibleContinent.id === targetContinent.id) {
      onScorePoints(15);
      onShowMessage(
        `🏆 FANTÁSTICO! Você alinhou a ${targetContinent.name} ${targetContinent.flag} e encontrou o ${targetContinent.mascot}! 🎉`,
      );
      setTargetContinentIdx((prev) => (prev + 1) % CONTINENTS.length);
    } else {
      onShowMessage(
        `📍 Você está vendo a ${currentVisibleContinent.name} ${currentVisibleContinent.flag}! Continue girando para achar a ${targetContinent.name}!`,
      );
    }
  };

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
      {/* Motor 3D Imersivo do Globo com Gestos de Arrasto e Pinça */}
      <View style={styles.geoGlobeContainer}>
        <Interactive3DViewport
          type="globe"
          initialScale={1.35} // Abre de forma grande e imersiva na tela do celular
          onRotationChange={handleRotationChange}
          badgeContent={
            <View style={styles.continentDetectorBadge}>
              <Text style={{ fontSize: rs(22) }}>{currentVisibleContinent.flag}</Text>
              <View>
                <Text style={{ color: '#F9FAFB', fontSize: rs(13), fontWeight: '800' }}>
                  {currentVisibleContinent.name}
                </Text>
                <Text style={{ color: '#38BDF8', fontSize: rs(11), fontWeight: '700' }}>
                  {currentVisibleContinent.mascot}
                </Text>
              </View>
            </View>
          }
        />
      </View>

      {/* Painel de Controle da Gincana no Rodapé */}
      <View style={styles.geoControlsContainer} pointerEvents="box-none">
        <View style={styles.geoChallengeBox}>
          <Text style={styles.geoChallengeTitle}>
            🎯 Missão Gincana: Encontre a {targetContinent.name} {targetContinent.flag}!
          </Text>
          <Text style={styles.geoChallengeSub}>
            Deslize o dedo no Globo 3D para girar em 360° ou use o gesto de pinça para ajustar o tamanho!
          </Text>

          <TouchableOpacity
            style={styles.confirmGeoBtn}
            onPress={handleCheckGeoChallenge}
            activeOpacity={0.85}
          >
            <Text style={styles.confirmGeoBtnText}>
              📍 Confirmar Continente Alinhado!
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  geoGlobeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '15%',
  },
  continentDetectorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs(10),
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    paddingHorizontal: rs(16),
    paddingVertical: rs(8),
    borderRadius: rs(20),
    borderWidth: 1.5,
    borderColor: '#38BDF8',
    elevation: 8,
  },
  geoControlsContainer: {
    position: 'absolute',
    bottom: rs(30),
    left: rs(16),
    right: rs(16),
    zIndex: 10,
  },
  geoChallengeBox: {
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    padding: rs(16),
    borderRadius: rs(20),
    borderWidth: 1.5,
    borderColor: '#FACC15',
    alignItems: 'center',
  },
  geoChallengeTitle: {
    color: '#FACC15',
    fontSize: rs(14),
    fontWeight: '800',
    textAlign: 'center',
  },
  geoChallengeSub: {
    color: '#94A3B8',
    fontSize: rs(11),
    textAlign: 'center',
    marginTop: rs(4),
    marginBottom: rs(12),
  },
  confirmGeoBtn: {
    width: '100%',
    backgroundColor: '#0284C7',
    paddingVertical: rs(12),
    borderRadius: rs(14),
    alignItems: 'center',
    elevation: 4,
  },
  confirmGeoBtnText: {
    color: '#FFFFFF',
    fontSize: rs(13),
    fontWeight: '800',
  },
});
