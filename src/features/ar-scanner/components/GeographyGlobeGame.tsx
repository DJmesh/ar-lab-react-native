/**
 * Component: GeographyGlobeGame
 * @description Módulo de Geografia Infantil — Gincana de caça aos continentes via Rotação Y 3D.
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
  const [targetContinentIdx, setTargetContinentIdx] = useState(3); // África

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

  const handleRotateGlobe = (deltaDegrees: number) => {
    setGlobeRotationY((prev) => (prev + deltaDegrees + 360) % 360);
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
      {/* Globo 3D Terrestre no Centro */}
      <View style={styles.geoGlobeContainer}>
        <TouchableOpacity
          style={[
            styles.arGlobeBubble,
            { transform: [{ rotate: `${globeRotationY}deg` }] },
          ]}
          onPress={() => handleRotateGlobe(45)}
          activeOpacity={0.9}
        >
          <Text style={{ fontSize: rs(96) }}>🌍</Text>
        </TouchableOpacity>

        <View style={styles.continentDetectorBadge}>
          <Text style={{ fontSize: rs(20) }}>{currentVisibleContinent.flag}</Text>
          <View>
            <Text style={{ color: '#F9FAFB', fontSize: rs(12), fontWeight: '800' }}>
              {currentVisibleContinent.name}
            </Text>
            <Text style={{ color: '#38BDF8', fontSize: rs(10), fontWeight: '700' }}>
              {currentVisibleContinent.mascot}
            </Text>
          </View>
        </View>
      </View>

      {/* Painel da Gincana no Rodapé */}
      <View style={styles.geoControlsContainer} pointerEvents="box-none">
        <View style={styles.geoChallengeBox}>
          <Text style={styles.geoChallengeTitle}>
            🎯 Missão Gincana: Encontre a {targetContinent.name} {targetContinent.flag}!
          </Text>
          <Text style={styles.geoChallengeSub}>
            Gire o Globo Terrestre e alinhe a {targetContinent.name} com o mascote {targetContinent.mascot}
          </Text>

          <View style={styles.geoButtonsRow}>
            <TouchableOpacity
              style={styles.rotateBtn}
              onPress={() => handleRotateGlobe(-45)}
            >
              <Text style={styles.rotateBtnText}>↺ Girar -45°</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.confirmGeoBtn}
              onPress={handleCheckGeoChallenge}
            >
              <Text style={styles.confirmGeoBtnText}>📍 Confirmar Continente!</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.rotateBtn}
              onPress={() => handleRotateGlobe(45)}
            >
              <Text style={styles.rotateBtnText}>↻ Girar +45°</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  geoGlobeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '30%',
  },
  arGlobeBubble: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    padding: rs(16),
    borderRadius: rs(80),
    borderWidth: 3,
    borderColor: '#38BDF8',
  },
  continentDetectorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs(10),
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    paddingHorizontal: rs(16),
    paddingVertical: rs(8),
    borderRadius: rs(20),
    borderWidth: 1.5,
    borderColor: '#38BDF8',
    marginTop: rs(16),
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
    padding: rs(14),
    borderRadius: rs(20),
    borderWidth: 1.5,
    borderColor: '#FACC15',
    alignItems: 'center',
  },
  geoChallengeTitle: {
    color: '#FACC15',
    fontSize: rs(13),
    fontWeight: '800',
    textAlign: 'center',
  },
  geoChallengeSub: {
    color: '#94A3B8',
    fontSize: rs(10),
    textAlign: 'center',
    marginTop: rs(2),
    marginBottom: rs(10),
  },
  geoButtonsRow: {
    flexDirection: 'row',
    gap: rs(8),
    alignItems: 'center',
    width: '100%',
  },
  rotateBtn: {
    backgroundColor: '#334155',
    paddingHorizontal: rs(12),
    paddingVertical: rs(8),
    borderRadius: rs(12),
  },
  rotateBtnText: {
    color: '#F9FAFB',
    fontSize: rs(11),
    fontWeight: '700',
  },
  confirmGeoBtn: {
    flex: 1,
    backgroundColor: '#0284C7',
    paddingVertical: rs(8),
    borderRadius: rs(12),
    alignItems: 'center',
  },
  confirmGeoBtnText: {
    color: '#FFFFFF',
    fontSize: rs(11),
    fontWeight: '800',
  },
});
