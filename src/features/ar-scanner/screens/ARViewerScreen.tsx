/**
 * Feature: AR Scanner — ARViewerScreen
 * @description Câmera Real + RA Mista Interativa + Jogo de Matemática + Gincana de Geografia por Rotação Y 3D.
 */
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  StatusBar,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useARScanner } from '../hooks/useARScanner';
import { ScanFrame }      from '../components/ScanFrame';
import { ScanTipOverlay } from '../components/ScanTipOverlay';
import { ModelInfoCard }  from '../components/ModelInfoCard';
import { LoadingOverlay } from '../../../shared/components/LoadingOverlay';
import { ErrorState }     from '../../../shared/components/ErrorState';
import { useTheme }       from '../../../shared/contexts/ThemeContext';
import { rs, rw, rh }     from '../../../shared/utils/responsive';
import type { RootStackParamList } from '../../../navigation/types';

type ARViewerRoute = RouteProp<RootStackParamList, 'ARViewer'>;

interface AppleItem {
  id: string;
  type: 'red' | 'green';
  label: string;
  xPct: number;
  yPct: number;
  organized: boolean;
}

interface ContinentInfo {
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
  { id: 'africa',        name: 'África',          flag: '🦁', mascot: 'Leão Rei 🦁',    minDegree: 210, maxDegree: 280 },
  { id: 'europe',        name: 'Europa',          flag: '🇪🇺', mascot: 'Águia Real 🦅',  minDegree: 280, maxDegree: 360 },
];

export const ARViewerScreen: React.FC = () => {
  const navigation = useNavigation();
  const route      = useRoute<ARViewerRoute>();
  const insets     = useSafeAreaInsets();
  const { labId, labName } = route.params;
  const { theme, isDark }  = useTheme();

  const [permission, requestPermission] = useCameraPermissions();
  const [interactiveScore, setInteractiveScore] = useState(0);
  const [celebrationMsg, setCelebrationMsg]     = useState<string | null>(null);

  // 🍎 Jogo de Organização de Maçãs (Matemática Pré-Escola)
  const isMathGame = labId.includes('math');
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

  // 🌍 Gincana do Globo Terrestre (Geografia Infantil por Rotação 3D)
  const isGeoGame = labId.includes('geo');
  const [globeRotationY, setGlobeRotationY] = useState(0); // 0 a 360 graus
  const [targetContinentIdx, setTargetContinentIdx] = useState(3); // Começa pedindo a África

  const {
    status, currentModel, scanTipVisible, errorMessage,
    hideScanTip, retry, clearModel,
  } = useARScanner({ labId, autoScan: true });

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission]);

  const isScanning  = status === 'scanning';
  const isLoading   = status === 'initializing' || status === 'model_loading';
  const isDetected  = status === 'model_ready' || status === 'marker_detected';
  const hasError    = ['error', 'camera_permission_denied', 'camera_unavailable'].includes(status);

  const c = theme.colors;
  const t = theme.typography;
  const s = theme.spacing;
  const r = theme.radius;

  const topPadding = Math.max(insets.top + rs(6), rs(36));

  // Lógica de cálculo de continente atual baseado no ângulo Y de rotação
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

  // Girar o Globo Terrestre em +45° ou -45°
  const handleRotateGlobe = (deltaDegrees: number) => {
    setGlobeRotationY((prev) => (prev + deltaDegrees + 360) % 360);
  };

  // Validar Desafio da Gincana Geográfica
  const handleCheckGeoChallenge = () => {
    if (currentVisibleContinent.id === targetContinent.id) {
      // ✅ Acertou o continente na gincana!
      setInteractiveScore((prev) => prev + 15);
      setCelebrationMsg(
        `🏆 FANTÁSTICO! Você alinhou a ${targetContinent.name} ${targetContinent.flag} e encontrou o ${targetContinent.mascot}! 🎉`,
      );
      // Avança para o próximo continente
      setTargetContinentIdx((prev) => (prev + 1) % CONTINENTS.length);
    } else {
      // ❌ Alinhou continente diferente
      setCelebrationMsg(
        `📍 Você está vendo a ${currentVisibleContinent.name} ${currentVisibleContinent.flag}! Continue girando para achar a ${targetContinent.name}!`,
      );
    }
  };

  // Lógica de Organização do Jogo Infantil de Matemática
  const handleSelectApple = (apple: AppleItem) => {
    if (apple.organized) return;
    setSelectedAppleId(apple.id);
    setCelebrationMsg(`🍎 Você selecionou a ${apple.label}! Agora toque na cesta correta abaixo!`);
  };

  const handlePlaceInBasket = (targetBasket: 'red' | 'green') => {
    if (!selectedAppleId) {
      setCelebrationMsg(`👉 Toque em uma maçã no chão antes de escolher a cesta!`);
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

      setInteractiveScore((prev) => prev + 10);
      setCelebrationMsg(
        `⭐ PARABÉNS! ${currentApple.type === 'red' ? 'Maçã Vermelha 🍎' : 'Maçã Verde 🍏'} guardada na cesta certa!`,
      );
      setSelectedAppleId(null);
    } else {
      setCelebrationMsg(
        `Ops! A ${currentApple.label} deve ir para a cesta de cor ${
          currentApple.type === 'red' ? 'VERMELHA 🔴' : 'VERDE 🟢'
        }! Tente de novo!`,
      );
    }
  };

  const remainingApples = apples.filter((a) => !a.organized).length;
  const totalOrganized = apples.length - remainingApples;

  const statusColor = isDetected
    ? c.semantic.success
    : isScanning
    ? c.brand.accent
    : c.semantic.warning;

  const statusLabel = isDetected
    ? 'Ambiente 3D Ativo'
    : isScanning
    ? 'Procurando Chão/Mesa'
    : 'Aguardando Câmera';

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* ── CÂMERA REAL DO DISPOSITIVO ──────────────────────────────── */}
      <View style={StyleSheet.absoluteFillObject}>
        {permission?.granted ? (
          <CameraView style={StyleSheet.absoluteFillObject} facing="back" />
        ) : (
          <View style={[styles.cameraFallback, { backgroundColor: isDark ? '#050810' : '#0F172A' }]}>
            <Text style={{ fontSize: rs(48), marginBottom: rs(12) }}>📷</Text>
            <Text style={{ color: '#F9FAFB', fontSize: t.size.base, fontWeight: '700', textAlign: 'center' }}>
              Permissão de Câmera Necessária
            </Text>
            <TouchableOpacity
              style={[styles.grantBtn, { backgroundColor: c.brand.primary }]}
              onPress={requestPermission}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: t.size.sm }}>
                Ativar Câmera 📸
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* ── ELEMENTOS 3D DOS JOGOS (MATEMÁTICA / GEOGRAFIA) ──────────── */}
      {isDetected && (
        <View style={styles.pokemonGoWorldOverlay} pointerEvents="box-none">
          {isMathGame ? (
            /* JOGO MATEMÁTICO: MAÇÃS ESPALHADAS NO AMBIENTE REAL */
            apples.map((apple) => {
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
            })
          ) : isGeoGame ? (
            /* GINCANA DE GEOGRAFIA: GLOBO TERRESTRE COM ROTAÇÃO Y 3D */
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

              {/* Tag com o Continente em Destaque pela Rotação Y */}
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
          ) : (
            /* OUTROS LABORATÓRIOS (PORTUGUÊS / QUÍMICA) */
            <TouchableOpacity
              style={styles.arObject3DBubble}
              onPress={() => {
                setInteractiveScore((prev) => prev + 5);
                setCelebrationMsg(`⭐ Muito bem! Você tocou no 3D! 🎉`);
                setTimeout(() => setCelebrationMsg(null), 3000);
              }}
              activeOpacity={0.8}
            >
              <Text style={{ fontSize: rs(58) }}>
                {labId.includes('port') ? '🐝' : '🧪'}
              </Text>
              <View style={styles.arPillBadge}>
                <Text style={{ color: '#FFFFFF', fontSize: rs(12), fontWeight: '800' }}>
                  Toque no 3D Mágico! ✨
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* ── PAINEL DE ROTAÇÃO E GINCANA (GEOGRAFIA) ────────────────── */}
      {isGeoGame && isDetected && (
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
      )}

      {/* ── CESTAS DE ORGANIZAÇÃO NO RODAPÉ (MATEMÁTICA) ──────────── */}
      {isMathGame && isDetected && (
        <View style={styles.basketsContainer} pointerEvents="box-none">
          <TouchableOpacity
            style={[
              styles.basketCard,
              { borderColor: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.25)' },
            ]}
            onPress={() => handlePlaceInBasket('red')}
            activeOpacity={0.85}
          >
            <Text style={{ fontSize: rs(36) }}>🧺 🍎</Text>
            <Text style={styles.basketTitle}>Cesta Vermelha</Text>
            <Text style={styles.basketCounter}>{basketRedCount} Maçãs</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.basketCard,
              { borderColor: '#22C55E', backgroundColor: 'rgba(34, 197, 94, 0.25)' },
            ]}
            onPress={() => handlePlaceInBasket('green')}
            activeOpacity={0.85}
          >
            <Text style={{ fontSize: rs(36) }}>🧺 🍏</Text>
            <Text style={styles.basketTitle}>Cesta Verde</Text>
            <Text style={styles.basketCounter}>{basketGreenCount} Maçãs</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── OVERLAY DE INTERFACE DE CONTROLE ───────────────────────── */}
      <View style={[styles.overlay, { paddingTop: topPadding }]} pointerEvents="box-none">
        {/* Header Seguro */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={[styles.circleBtn, { backgroundColor: 'rgba(0,0,0,0.65)' }]}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Text style={{ color: '#F9FAFB', fontSize: rs(20), fontWeight: '600' }}>←</Text>
          </TouchableOpacity>

          <View style={{ flex: 1, alignItems: 'center', gap: rs(2) }}>
            <Text style={{ color: '#F9FAFB', fontSize: t.size.base, fontWeight: '700' }} numberOfLines={1}>
              {labName}
            </Text>
            <View style={[styles.statusPill, { backgroundColor: 'rgba(0,0,0,0.65)' }]}>
              <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
              <Text style={{ color: '#E5E7EB', fontSize: t.size.xs, fontWeight: '600' }}>
                {statusLabel}
              </Text>
            </View>
          </View>

          <View style={[styles.scoreBadge, { backgroundColor: c.brand.primary }]}>
            <Text style={{ color: c.text.onBrand, fontSize: t.size.xs, fontWeight: '800' }}>
              ⭐ {interactiveScore} PTS
            </Text>
          </View>
        </View>

        {/* Banner do Jogo de Organização (Matemática) */}
        {isMathGame && isDetected && (
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
        )}

        {/* Mensagem de Celebração Infantil */}
        {celebrationMsg && (
          <View style={[styles.celebrationToast, { backgroundColor: '#10B981' }]}>
            <Text style={{ color: '#FFFFFF', fontSize: t.size.xs, fontWeight: '800', textAlign: 'center' }}>
              {celebrationMsg}
            </Text>
          </View>
        )}

        {!hasError && !isLoading && !isDetected && (
          <View style={styles.scanArea} pointerEvents="box-none">
            <ScanFrame isScanning={isScanning} isDetected={isDetected} />
          </View>
        )}

        {isLoading && (
          <View style={styles.centered}>
            <LoadingOverlay
              message="Inicializando ambiente 3D..."
              subMessage="Preparando aprendizado lúdico"
              variant="ar"
            />
          </View>
        )}

        {hasError && (
          <ErrorState
            title="Câmera indisponível"
            message={errorMessage ?? 'Não foi possível inicializar a câmera.'}
            icon="📷"
            actionLabel="Tentar novamente"
            onAction={retry}
          />
        )}

        {currentModel && isDetected && !isMathGame && !isGeoGame && (
          <ModelInfoCard model={currentModel} onDismiss={clearModel} />
        )}
      </View>

      {scanTipVisible && !hasError && (
        <ScanTipOverlay onDismiss={hideScanTip} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root:       { flex: 1, backgroundColor: '#000000' },
  cameraFallback: {
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
  overlay:    { flex: 1 },
  headerRow:  {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: rs(16), gap: rs(12),
  },
  scanArea:   { flex: 1, alignItems: 'center', justifyContent: 'center', gap: rs(16) },
  centered:   { flex: 1, alignItems: 'center', justifyContent: 'center' },
  circleBtn:  {
    width:          rs(40),
    height:         rs(40),
    borderRadius:   rs(20),
    alignItems:     'center',
    justifyContent: 'center',
  },
  scoreBadge: {
    paddingHorizontal: rs(12),
    paddingVertical:   rs(6),
    borderRadius:      rs(16),
  },
  statusPill: {
    flexDirection:    'row',
    alignItems:       'center',
    gap:              rs(6),
    paddingHorizontal: rs(10),
    paddingVertical:  rs(3),
    borderRadius:     9999,
  },
  statusDot: {
    width:        rs(8),
    height:       rs(8),
    borderRadius: rs(4),
  },
  celebrationToast: {
    marginHorizontal: rs(16),
    marginTop:        rs(8),
    padding:          rs(10),
    borderRadius:     rs(12),
    alignItems:       'center',
  },
  gameInstructionBanner: {
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    marginHorizontal: rs(16),
    marginTop: rs(10),
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
  arObject3DBubble: {
    alignSelf: 'center',
    marginTop: '40%',
    alignItems:      'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    padding:         rs(20),
    borderRadius:    rs(32),
    borderWidth:     3,
    borderColor:     '#38BDF8',
    elevation:       10,
  },
  arPillBadge: {
    backgroundColor: '#0EA5E9',
    paddingHorizontal: rs(12),
    paddingVertical: rs(5),
    borderRadius: rs(14),
    marginTop: rs(8),
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
