/**
 * Component: MathAppleSortingGame
 * @description Módulo de Matemática Infantil — Jogo pedagógico de organização (Maçãs Vermelhas vs Verdes) com motor 3D gestual.
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Interactive3DViewport } from './Interactive3DViewport';
import { rs } from '../../../shared/utils/responsive';

export interface AppleItem {
  id: string;
  type: 'red' | 'green';
  label: string;
  xPct: number;
  yPct: number;
  organized: boolean;
}

interface MathAppleSortingGameProps {
  onScorePoints: (pts: number) => void;
  onShowMessage: (msg: string) => void;
}

export const MathAppleSortingGame: React.FC<MathAppleSortingGameProps> = ({
  onScorePoints,
  onShowMessage,
}) => {
  const [selectedAppleId, setSelectedAppleId] = useState<string | null>(null);
  const [apples, setApples] = useState<AppleItem[]>([
    { id: 'app-1', type: 'red',   label: 'Maçã Vermelha 1', xPct: 20, yPct: 32, organized: false },
    { id: 'app-2', type: 'green', label: 'Maçã Verde 1',    xPct: 65, yPct: 26, organized: false },
    { id: 'app-3', type: 'red',   label: 'Maçã Vermelha 2', xPct: 42, yPct: 46, organized: false },
    { id: 'app-4', type: 'green', label: 'Maçã Verde 2',    xPct: 15, yPct: 56, organized: false },
    { id: 'app-5', type: 'red',   label: 'Maçã Vermelha 3', xPct: 72, yPct: 60, organized: false },
    { id: 'app-6', type: 'green', label: 'Maçã Verde 3',    xPct: 48, yPct: 18, organized: false },
  ]);

  const [basketRedCount, setBasketRedCount]     = useState(0);
  const [basketGreenCount, setBasketGreenCount] = useState(0);

  const handleSelectApple = (apple: AppleItem) => {
    if (apple.organized) return;
    setSelectedAppleId(apple.id);
    onShowMessage(`🍎 Você selecionou a ${apple.label}! Agora toque na cesta correta abaixo!`);
  };

  const handlePlaceInBasket = (targetBasket: 'red' | 'green') => {
    if (!selectedAppleId) {
      onShowMessage(`👉 Toque em uma maçã no chão antes de escolher a cesta!`);
      return;
    }

    const currentApple = apples.find((a) => a.id === selectedAppleId);
    if (!currentApple) return;

    if (currentApple.type === targetBasket) {
      setApples((prev) =>
        prev.map((a) => (a.id === selectedAppleId ? { ...a, organized: true } : a)),
      );
      if (targetBasket === 'red') setBasketRedCount((v) => v + 1);
      else setBasketGreenCount((v) => v + 1);

      onScorePoints(10);
      onShowMessage(
        `⭐ PARABÉNS! ${currentApple.type === 'red' ? 'Maçã Vermelha 🍎' : 'Maçã Verde 🍏'} guardada na cesta certa!`,
      );
      setSelectedAppleId(null);
    } else {
      onShowMessage(
        `Ops! A ${currentApple.label} deve ir para a cesta de cor ${
          currentApple.type === 'red' ? 'VERMELHA 🔴' : 'VERDE 🟢'
        }! Tente de novo!`,
      );
    }
  };

  const remainingApples = apples.filter((a) => !a.organized).length;
  const totalOrganized = apples.length - remainingApples;

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
      {/* Banner Superior de Instruções */}
      <View style={styles.bannerContainer} pointerEvents="box-none">
        <View style={styles.gameInstructionBanner}>
          <Text style={styles.bannerTitle}>
            🎯 Jogo do Senso de Organização ({totalOrganized}/{apples.length})
          </Text>
          <Text style={styles.bannerSub}>
            {remainingApples > 0
              ? 'Toque numa maçã 3D no chão e guarde-a na cesta da mesma cor!'
              : '🏆 PARABÉNS! VOCÊ ORGANIZOU TODAS AS MAÇÃS COM SUCESSO! 🎉'}
          </Text>
        </View>
      </View>

      {/* Maçãs 3D com Iluminação Specular e Sombra de Piso Real */}
      <View style={styles.pokemonGoWorldOverlay} pointerEvents="box-none">
        {apples.map((apple) => {
          if (apple.organized) return null;
          const isSelected = selectedAppleId === apple.id;

          return (
            <View
              key={apple.id}
              style={[
                styles.arApplePositionWrapper,
                {
                  left: `${apple.xPct}%`,
                  top: `${apple.yPct}%`,
                },
              ]}
            >
              <Interactive3DViewport
                type={apple.type === 'red' ? 'apple_red' : 'apple_green'}
                initialScale={isSelected ? 1.4 : 1.0}
                onTap={() => handleSelectApple(apple)}
                badgeContent={
                  isSelected ? (
                    <View style={styles.selectedIndicatorPill}>
                      <Text style={{ color: '#000', fontSize: rs(9), fontWeight: '900' }}>SELECIONADA ✨</Text>
                    </View>
                  ) : undefined
                }
              />
            </View>
          );
        })}
      </View>

      {/* Cestas de Separação no Rodapé */}
      <View style={styles.basketsContainer} pointerEvents="box-none">
        <TouchableOpacity
          style={[styles.basketCard, { borderColor: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.25)' }]}
          onPress={() => handlePlaceInBasket('red')}
          activeOpacity={0.85}
        >
          <Text style={{ fontSize: rs(36) }}>🧺 🍎</Text>
          <Text style={styles.basketTitle}>Cesta Vermelha</Text>
          <Text style={styles.basketCounter}>{basketRedCount} Maçãs</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.basketCard, { borderColor: '#22C55E', backgroundColor: 'rgba(34, 197, 94, 0.25)' }]}
          onPress={() => handlePlaceInBasket('green')}
          activeOpacity={0.85}
        >
          <Text style={{ fontSize: rs(36) }}>🧺 🍏</Text>
          <Text style={styles.basketTitle}>Cesta Verde</Text>
          <Text style={styles.basketCounter}>{basketGreenCount} Maçãs</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    paddingTop: rs(80),
    alignItems: 'center',
    zIndex: 20,
  },
  gameInstructionBanner: {
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    marginHorizontal: rs(16),
    padding: rs(12),
    borderRadius: rs(16),
    borderWidth: 1,
    borderColor: '#38BDF8',
    alignItems: 'center',
  },
  bannerTitle: {
    color: '#FACC15',
    fontSize: rs(13),
    fontWeight: '800',
  },
  bannerSub: {
    color: '#F9FAFB',
    fontSize: rs(11),
    fontWeight: '600',
    textAlign: 'center',
    marginTop: rs(2),
  },
  pokemonGoWorldOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 5,
  },
  arApplePositionWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedIndicatorPill: {
    backgroundColor: '#FACC15',
    paddingHorizontal: rs(8),
    paddingVertical: rs(3),
    borderRadius: rs(8),
    marginTop: rs(2),
    elevation: 4,
  },
  basketsContainer: {
    position: 'absolute',
    bottom: rs(30),
    left: rs(16),
    right: rs(16),
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: rs(16),
    zIndex: 10,
  },
  basketCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: rs(12),
    paddingHorizontal: rs(8),
    borderRadius: rs(20),
    borderWidth: 2.5,
    elevation: 6,
  },
  basketTitle: {
    color: '#F9FAFB',
    fontSize: rs(12),
    fontWeight: '800',
    marginTop: rs(4),
  },
  basketCounter: {
    color: '#E2E8F0',
    fontSize: rs(10),
    fontWeight: '700',
    marginTop: rs(2),
  },
});
