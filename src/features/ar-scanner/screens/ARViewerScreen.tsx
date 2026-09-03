/**
 * Feature: AR Scanner — ARViewerScreen (Real Hardware Camera + Kids AR + Safe Area + Pokémon GO Style Interactive World)
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

export const ARViewerScreen: React.FC = () => {
  const navigation = useNavigation();
  const route      = useRoute<ARViewerRoute>();
  const insets     = useSafeAreaInsets();
  const { labId, labName } = route.params;
  const { theme, isDark }  = useTheme();

  const [permission, requestPermission] = useCameraPermissions();
  const [interactiveScore, setInteractiveScore] = useState(0);
  const [celebrationMsg, setCelebrationMsg]     = useState<string | null>(null);

  const {
    status, currentModel, scanTipVisible, errorMessage,
    hideScanTip, scanForMarker, retry, clearModel,
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

  const handleTap3DObject = (objectName: string) => {
    setInteractiveScore((prev) => prev + 1);
    setCelebrationMsg(`⭐ Muito bem! Você tocou no 3D: ${objectName}! 🎉`);
    setTimeout(() => setCelebrationMsg(null), 3000);
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

      {/* ── CÂMERA REAL DO DISPOSITIVO (Expo CameraView) ─────────────── */}
      <View style={StyleSheet.absoluteFillObject}>
        {permission?.granted ? (
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
          />
        ) : (
          <View style={[styles.cameraFallback, { backgroundColor: isDark ? '#050810' : '#0F172A' }]}>
            <Text style={{ fontSize: rs(48), marginBottom: rs(12) }}>📷</Text>
            <Text style={{ color: '#F9FAFB', fontSize: t.size.base, fontWeight: '700', textAlign: 'center' }}>
              Permissão de Câmera Necessária
            </Text>
            <Text style={{ color: '#9CA3AF', fontSize: t.size.xs, textAlign: 'center', marginVertical: rs(8), paddingHorizontal: rs(24) }}>
              Para interagir com o mundo 3D em Realidade Aumentada estilo Pokémon GO, libere o acesso à câmera.
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

      {/* ── ELEMENTOS 3D INTERATIVOS SOBREPOSTOS NA CÂMERA REAL ─────── */}
      {isDetected && (
        <View style={styles.pokemonGoWorldOverlay}>
          <TouchableOpacity
            style={styles.arObject3DBubble}
            onPress={() => handleTap3DObject(currentModel?.name ?? 'Objeto Educacional')}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: rs(54) }}>
              {labId.includes('math') ? '🍎' : labId.includes('geo') ? '🌍' : labId.includes('port') ? '🐝' : '🧪'}
            </Text>
            <View style={styles.arPillBadge}>
              <Text style={{ color: '#FFFFFF', fontSize: rs(12), fontWeight: '800' }}>
                Toque no 3D Mágico! ✨
              </Text>
            </View>
          </TouchableOpacity>

          {labId.includes('math') && (
            <View style={styles.mathFruitsRow}>
              <TouchableOpacity onPress={() => handleTap3DObject('Maçã 1')}>
                <Text style={{ fontSize: rs(42) }}>🍎</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleTap3DObject('Maçã 2')}>
                <Text style={{ fontSize: rs(42) }}>🍎</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleTap3DObject('Maçã 3')}>
                <Text style={{ fontSize: rs(42) }}>🍎</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* ── OVERLAY DE INTERFACE (Header + Status + Quizzes) ─────────── */}
      <View style={[styles.overlay, { paddingTop: topPadding }]} pointerEvents="box-none">
        {/* Header Seguro */}
        <View
          style={{
            flexDirection: 'row', alignItems: 'center',
            paddingHorizontal: s.base, gap: s.sm,
          }}
        >
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
              ⭐ {interactiveScore}
            </Text>
          </View>
        </View>

        {/* Mensagem de Celebração Infantil */}
        {celebrationMsg && (
          <View style={[styles.celebrationToast, { backgroundColor: '#10B981' }]}>
            <Text style={{ color: '#FFFFFF', fontSize: t.size.sm, fontWeight: '800', textAlign: 'center' }}>
              {celebrationMsg}
            </Text>
          </View>
        )}

        {/* Área central com ScanFrame */}
        {!hasError && !isLoading && (
          <View style={styles.scanArea} pointerEvents="box-none">
            <ScanFrame isScanning={isScanning} isDetected={isDetected} />
            {isScanning && (
              <Text
                style={{
                  color:             '#F9FAFB',
                  fontSize:          t.size.xs,
                  fontWeight:        '600',
                  backgroundColor:   'rgba(0,0,0,0.75)',
                  paddingHorizontal: s.base,
                  paddingVertical:   s.sm,
                  borderRadius:      r.full,
                  overflow:          'hidden',
                }}
              >
                Aponte a câmera para o chão ou mesa para visualizar
              </Text>
            )}
          </View>
        )}

        {isLoading && (
          <View style={styles.centered}>
            <LoadingOverlay
              message={status === 'initializing' ? 'Inicializando câmera de RA...' : 'Carregando mundo 3D...'}
              subMessage="Preparando aprendizado interativo"
              variant="ar"
            />
          </View>
        )}

        {hasError && (
          <ErrorState
            title={status === 'camera_permission_denied' ? 'Câmera sem permissão' : 'Câmera indisponível'}
            message={errorMessage ?? 'Não foi possível inicializar a câmera.'}
            icon={status === 'camera_permission_denied' ? '🔒' : '📷'}
            actionLabel="Tentar novamente"
            onAction={retry}
          />
        )}

        {currentModel && isDetected && (
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
    marginHorizontal: rs(20),
    marginTop:        rs(12),
    padding:          rs(10),
    borderRadius:     rs(12),
    alignItems:       'center',
  },
  pokemonGoWorldOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems:     'center',
    justifyContent: 'center',
    zIndex:         5,
  },
  arObject3DBubble: {
    alignItems:      'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    padding:         rs(20),
    borderRadius:    rs(32),
    borderWidth:     3,
    borderColor:     '#38BDF8',
    elevation:       10,
    shadowColor:     '#38BDF8',
    shadowRadius:    12,
    shadowOpacity:   0.8,
  },
  arPillBadge: {
    backgroundColor: '#0EA5E9',
    paddingHorizontal: rs(12),
    paddingVertical: rs(5),
    borderRadius: rs(14),
    marginTop: rs(8),
  },
  mathFruitsRow: {
    flexDirection: 'row',
    gap: rs(18),
    marginTop: rs(24),
    backgroundColor: 'rgba(0,0,0,0.65)',
    padding: rs(12),
    borderRadius: rs(20),
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
});
