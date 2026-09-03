/**
 * Feature: AR Scanner — ARViewerScreen (Kids AR + Safe Area + Pokémon GO Style Interactive World)
 */
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  StatusBar, Animated,
} from 'react-native';
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

  const [interactiveScore, setInteractiveScore] = useState(0);
  const [celebrationMsg, setCelebrationMsg]     = useState<string | null>(null);

  const {
    status, currentModel, scanTipVisible, errorMessage,
    hideScanTip, scanForMarker, retry, clearModel,
  } = useARScanner({ labId, autoScan: true });

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

      {/* ── Câmera simulada RA (Estilo Pokémon GO) ─────────────── */}
      <View style={[styles.camera, { backgroundColor: isDark ? '#050810' : '#0F172A' }]}>
        <Text style={styles.cameraIcon}>📷</Text>
        
        {/* Renderização de elementos 3D interativos estilo Pokémon GO no chão/superfície */}
        {isDetected && (
          <View style={styles.pokemonGoWorldContainer}>
            <TouchableOpacity
              style={styles.arObject3DBubble}
              onPress={() => handleTap3DObject(currentModel?.name ?? 'Objeto Educacional')}
              activeOpacity={0.8}
            >
              <Text style={{ fontSize: rs(44) }}>
                {labId.includes('math') ? '🍎' : labId.includes('geo') ? '🌍' : labId.includes('port') ? '🐝' : '🧪'}
              </Text>
              <View style={styles.arPillBadge}>
                <Text style={{ color: '#FFFFFF', fontSize: rs(11), fontWeight: '700' }}>
                  Toque para Interagir! ✨
                </Text>
              </View>
            </TouchableOpacity>

            {labId.includes('math') && (
              <View style={styles.mathFruitsRow}>
                <TouchableOpacity onPress={() => handleTap3DObject('Maçã 1')}>
                  <Text style={{ fontSize: rs(36) }}>🍎</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleTap3DObject('Maçã 2')}>
                  <Text style={{ fontSize: rs(36) }}>🍎</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleTap3DObject('Maçã 3')}>
                  <Text style={{ fontSize: rs(36) }}>🍎</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {(isScanning || isDetected) && (
          <Text style={[styles.cameraHint, { color: '#9CA3AF' }]}>
            {isScanning ? 'Varredura de superfície ativa...' : 'Ambiente 3D Projetado no Mundo Real!'}
          </Text>
        )}
      </View>

      <View style={[styles.overlay, { paddingTop: topPadding }]}>
        {/* Header Seguro */}
        <View
          style={{
            flexDirection: 'row', alignItems: 'center',
            paddingHorizontal: s.base, gap: s.sm,
          }}
        >
          <TouchableOpacity
            style={[styles.circleBtn, { backgroundColor: 'rgba(0,0,0,0.6)' }]}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Text style={{ color: '#F9FAFB', fontSize: rs(20), fontWeight: '600' }}>←</Text>
          </TouchableOpacity>

          <View style={{ flex: 1, alignItems: 'center', gap: rs(2) }}>
            <Text style={{ color: '#F9FAFB', fontSize: t.size.base, fontWeight: '700' }} numberOfLines={1}>
              {labName}
            </Text>
            <View style={[styles.statusPill, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
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
            <Text style={{ color: '#FFFFFF', fontSize: t.size.sm, fontWeight: '700', textAlign: 'center' }}>
              {celebrationMsg}
            </Text>
          </View>
        )}

        {/* Área central */}
        {!hasError && !isLoading && (
          <View style={styles.scanArea}>
            <ScanFrame isScanning={isScanning} isDetected={isDetected} />
            {isScanning && (
              <Text
                style={{
                  color:             '#F9FAFB',
                  fontSize:          t.size.xs,
                  fontWeight:        '600',
                  backgroundColor:   'rgba(0,0,0,0.7)',
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
  root:       { flex: 1, backgroundColor: '#0A0E1A' },
  camera:     {
    ...StyleSheet.absoluteFillObject,
    alignItems:     'center',
    justifyContent: 'center',
  },
  cameraIcon: { fontSize: rs(72), opacity: 0.10 },
  cameraHint: { fontSize: rs(12), marginTop: rs(8), fontWeight: '600' },
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
  pokemonGoWorldContainer: {
    alignItems:     'center',
    justifyContent: 'center',
    marginVertical: rs(10),
  },
  arObject3DBubble: {
    alignItems:      'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding:         rs(16),
    borderRadius:    rs(24),
    borderWidth:     2,
    borderColor:     '#38BDF8',
  },
  arPillBadge: {
    backgroundColor: '#0EA5E9',
    paddingHorizontal: rs(10),
    paddingVertical: rs(4),
    borderRadius: rs(12),
    marginTop: rs(6),
  },
  mathFruitsRow: {
    flexDirection: 'row',
    gap: rs(16),
    marginTop: rs(16),
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: rs(10),
    borderRadius: rs(16),
  },
});
