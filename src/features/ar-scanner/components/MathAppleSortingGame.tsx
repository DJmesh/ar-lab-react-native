/**
 * Component: MathAppleSortingGame
 * @description Módulo de Matemática Infantil — Jogo pedagógico de organização (Maçãs Vermelhas vs Verdes).
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
    { id: 'app-1', type: 'red',   label: 'Maçã Vermelha 1', xPct: 22, yPct: 35, organized: false },
    { id: 'app-2', type: 'green', label: 'Maçã Verde 1',    xPct: 68, yPct: 28, organized: false },
    { id: 'app-3', type: 'red',   label: 'Maçã Vermelha 2', xPct: 45, yPct: 48, organized: false },
    { id: 'app-4', type: 'green', label: 'Maçã Verde 2',    xPct: 18, yPct: 58, organized: false },
    { id: 'app-5', type: 'red',   label: 'Maçã Vermelha 3', xPct: 75, yPct: 62, organized: false },
    { id: 'app-6', type: 'green', label: 'Maçã Verde 3',    xPct: 50, yPct: 20, organized: false },
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
              ? 'Toque numa maçã no chão e guarde-a na cesta da mesma cor!'
              : '🏆 PARABÉNS! VOCÊ ORGANIZOU TODAS AS MAÇÃS COM SUCESSO! 🎉'}
          </Text>
        </View>
      </View>

      {/* Maçãs 3D no Espaço Real */}
      <View style={styles.pokemonGoWorldOverlay} pointerEvents="box-none">
        {apples.map((apple) => {
          if (apple.organized) return null;
          const isSelected = selectedAppleId === apple.id;

          return (
            <TouchableOpacity
              key={apple.id}
              style={[
                styles.arApple3DBubble,
                {
                  left: `${apple.xPct}%`,
                  top: `${apple.yPct}%`,
                  borderColor: isSelected ? '#FACC15' : apple.type === 'red' ? '#EF4444' : '#22C55E',
                  transform: [{ scale: isSelected ? 1.25 : 1.0 }],
                },
              ]}
              onPress={() => handleSelectApple(apple)}
              activeOpacity={0.8}
            >
              <Text style={{ fontSize: rs(48) }}>
                {apple.type === 'red' ? '🍎' : '🍏'}
              </Text>
              {isSelected && (
                <View style={styles.selectedIndicatorPill}>
                  <Text style={{ color: '#000', fontSize: rs(9), fontWeight: '900' }}>SELECIONADA ✨</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Cestas no Rodapé */}
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
  arApple3DBubble: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.22)',
    padding: rs(12),
    borderRadius: rs(28),
    borderWidth: 3,
    shadowColor: '#000000',
    shadowRadius: 10,
    shadowOpacity: 0.5,
    elevation: 8,
  },
  selectedIndicatorPill: {
    backgroundColor: '#FACC15',
    paddingHorizontal: rs(6),
    paddingVertical: rs(2),
    borderRadius: rs(8),
    marginTop: rs(4),
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
