/**
 * Feature: AR Scanner — ARViewerScreen (theme-aware + responsive)
 */
import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  StatusBar, SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useARScanner } from '../hooks/useARScanner';
import { ScanFrame }      from '../components/ScanFrame';
import { ScanTipOverlay } from '../components/ScanTipOverlay';
import { ModelInfoCard }  from '../components/ModelInfoCard';
import { LoadingOverlay } from '../../../shared/components/LoadingOverlay';
import { ErrorState }     from '../../../shared/components/ErrorState';
import { useTheme }       from '../../../shared/contexts/ThemeContext';
import { rs, rw }         from '../../../shared/utils/responsive';
import type { RootStackParamList } from '../../../navigation/types';

type ARViewerRoute = RouteProp<RootStackParamList, 'ARViewer'>;

export const ARViewerScreen: React.FC = () => {
  const navigation = useNavigation();
  const route      = useRoute<ARViewerRoute>();
  const { labId, labName } = route.params;
  const { theme, isDark }  = useTheme();

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

  const statusColor = isDetected
    ? c.semantic.success
    : isScanning
    ? c.brand.accent
    : c.semantic.warning;

  const statusLabel = isDetected
    ? 'Modelo ativo'
    : isScanning
    ? 'Escaneando'
    : 'Aguardando';

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Câmera simulada */}
      <View style={[styles.camera, { backgroundColor: isDark ? '#050810' : '#0F172A' }]}>
        <Text style={styles.cameraIcon}>📷</Text>
        {(isScanning || isDetected) && (
          <Text style={[styles.cameraHint, { color: c.text.tertiary }]}>
            {isScanning ? 'Varredura ativa...' : 'Modelo detectado!'}
          </Text>
        )}
      </View>

      <SafeAreaView style={styles.overlay}>
        {/* Header */}
        <View
          style={{
            flexDirection: 'row', alignItems: 'center',
            paddingHorizontal: s.base, paddingTop: s.base, gap: s.sm,
          }}
        >
          <TouchableOpacity
            style={[styles.circleBtn, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Text style={{ color: '#F9FAFB', fontSize: rs(20), fontWeight: '600' }}>←</Text>
          </TouchableOpacity>

          <View style={{ flex: 1, alignItems: 'center', gap: rs(4) }}>
            <Text style={{ color: '#F9FAFB', fontSize: t.size.base, fontWeight: '700' }} numberOfLines={1}>
              {labName}
            </Text>
            <View style={[styles.statusPill, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
              <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
              <Text style={{ color: '#9CA3AF', fontSize: t.size.xs, fontWeight: '500' }}>
                {statusLabel}
              </Text>
            </View>
          </View>

          {!isLoading && !hasError && (
            <TouchableOpacity
              style={[styles.circleBtn, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
              onPress={scanForMarker}
              activeOpacity={0.8}
            >
              <Text style={{ color: c.brand.accent, fontSize: rs(22), fontWeight: '600' }}>⟳</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Área central */}
        {!hasError && !isLoading && (
          <View style={styles.scanArea}>
            <ScanFrame isScanning={isScanning} isDetected={isDetected} />
            {isScanning && (
              <Text
                style={{
                  color:             '#9CA3AF',
                  fontSize:          t.size.sm,
                  backgroundColor:   'rgba(0,0,0,0.55)',
                  paddingHorizontal: s.base,
                  paddingVertical:   s.sm,
                  borderRadius:      r.full,
                  overflow:          'hidden',
                }}
              >
                Aponte para o marcador do laboratório
              </Text>
            )}
          </View>
        )}

        {isLoading && (
          <View style={styles.centered}>
            <LoadingOverlay
              message={status === 'initializing' ? 'Inicializando câmera de RA...' : 'Carregando modelo 3D...'}
              subMessage={status === 'model_loading' ? 'Preparando visualização educacional' : 'Configurando ambiente de RA'}
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
      </SafeAreaView>

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
  cameraIcon: { fontSize: rs(72), opacity: 0.12 },
  cameraHint: { fontSize: rs(13), marginTop: rs(8), opacity: 0.45 },
  overlay:    { flex: 1 },
  scanArea:   { flex: 1, alignItems: 'center', justifyContent: 'center', gap: rs(20) },
  centered:   { flex: 1, alignItems: 'center', justifyContent: 'center' },
  circleBtn:  {
    width:          rs(40),
    height:         rs(40),
    borderRadius:   rs(20),
    alignItems:     'center',
    justifyContent: 'center',
  },
  statusPill: {
    flexDirection:    'row',
    alignItems:       'center',
    gap:              rs(5),
    paddingHorizontal: rs(10),
    paddingVertical:  rs(3),
    borderRadius:     9999,
  },
  statusDot: {
    width:        rs(6),
    height:       rs(6),
    borderRadius: rs(3),
  },
});
