/**
 * Feature: AR Scanner — ARViewerScreen
 * @description Tela Orquestradora do Scanner RA em Câmera Nativa (Clean Architecture / Clean Code).
 */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useARScanner } from '../hooks/useARScanner';
import { ARCameraView } from '../components/ARCameraView';
import { ARHeaderOverlay } from '../components/ARHeaderOverlay';
import { MathAppleSortingGame } from '../components/MathAppleSortingGame';
import { GeographyGlobeGame } from '../components/GeographyGlobeGame';
import { ScanFrame } from '../components/ScanFrame';
import { ScanTipOverlay } from '../components/ScanTipOverlay';
import { ModelInfoCard } from '../components/ModelInfoCard';
import { LoadingOverlay } from '../../../shared/components/LoadingOverlay';
import { ErrorState } from '../../../shared/components/ErrorState';
import { useTheme } from '../../../shared/contexts/ThemeContext';
import { rs } from '../../../shared/utils/responsive';
import type { RootStackParamList } from '../../../navigation/types';

type ARViewerRoute = RouteProp<RootStackParamList, 'ARViewer'>;

export const ARViewerScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<ARViewerRoute>();
  const insets = useSafeAreaInsets();
  const { labId, labName } = route.params;
  const { theme } = useTheme();

  const [permission, requestPermission] = useCameraPermissions();
  const [interactiveScore, setInteractiveScore] = useState(0);
  const [celebrationMsg, setCelebrationMsg] = useState<string | null>(null);

  const isMathGame = labId.includes('math');
  const isGeoGame = labId.includes('geo');

  const {
    status, currentModel, scanTipVisible, errorMessage,
    hideScanTip, retry, clearModel,
  } = useARScanner({ labId, autoScan: true });

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission]);

  const isScanning = status === 'scanning';
  const isLoading = status === 'initializing' || status === 'model_loading';
  const isDetected = status === 'model_ready' || status === 'marker_detected';
  const hasError = ['error', 'camera_permission_denied', 'camera_unavailable'].includes(status);

  const c = theme.colors;
  const t = theme.typography;
  const topPadding = Math.max(insets.top + rs(6), rs(36));

  const handleScorePoints = (pts: number) => {
    setInteractiveScore((prev) => prev + pts);
  };

  const handleShowMessage = (msg: string) => {
    setCelebrationMsg(msg);
    setTimeout(() => setCelebrationMsg(null), 4000);
  };

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

      {/* 1. Feed da Câmera Real */}
      <ARCameraView
        permission={permission}
        onRequestPermission={requestPermission}
      />

      {/* 2. Submódulos Pedagógicos 3D Interativos */}
      {isDetected && (
        <>
          {isMathGame ? (
            <MathAppleSortingGame
              onScorePoints={handleScorePoints}
              onShowMessage={handleShowMessage}
            />
          ) : isGeoGame ? (
            <GeographyGlobeGame
              onScorePoints={handleScorePoints}
              onShowMessage={handleShowMessage}
            />
          ) : (
            <View style={styles.pokemonGoWorldOverlay} pointerEvents="box-none">
              <TouchableOpacity
                style={styles.arObject3DBubble}
                onPress={() => {
                  handleScorePoints(5);
                  handleShowMessage(`⭐ Muito bem! Você tocou no 3D! 🎉`);
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
            </View>
          )}
        </>
      )}

      {/* 3. Overlay Principal de Interface */}
      <View style={styles.overlay} pointerEvents="box-none">
        <ARHeaderOverlay
          labName={labName}
          statusLabel={statusLabel}
          statusColor={statusColor}
          score={interactiveScore}
          topPadding={topPadding}
          onGoBack={() => navigation.goBack()}
        />

        {celebrationMsg && (
          <View style={styles.celebrationToast}>
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
  root: { flex: 1, backgroundColor: '#000000' },
  overlay: { flex: 1 },
  scanArea: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  celebrationToast: {
    marginHorizontal: rs(16),
    marginTop: rs(8),
    padding: rs(10),
    borderRadius: rs(12),
    backgroundColor: '#10B981',
    alignItems: 'center',
  },
  pokemonGoWorldOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 5,
  },
  arObject3DBubble: {
    alignSelf: 'center',
    marginTop: '40%',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    padding: rs(20),
    borderRadius: rs(32),
    borderWidth: 3,
    borderColor: '#38BDF8',
    elevation: 10,
  },
  arPillBadge: {
    backgroundColor: '#0EA5E9',
    paddingHorizontal: rs(12),
    paddingVertical: rs(5),
    borderRadius: rs(14),
    marginTop: rs(8),
  },
});
