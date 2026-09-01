/**
 * Feature: AR Scanner — Hook (Container Logic)
 * @description Hook de negócio que orquestra câmera, permissões, detecção de marcadores
 * e resolução de modelos 3D. Segue o padrão Container/Presentational.
 */
import { useEffect, useCallback, useRef } from 'react';
import { useARScannerStore } from '../store/arScannerStore';
import { cameraService } from '../services/CameraService';
import { ARModelRepositoryImpl } from '../../../data/repositories/LaboratoryRepositoryImpl';
import { ResolveARModelUseCase } from '../../../domain/usecases/LaboratoryUseCases';
import { MOCK_LABORATORIES } from '../../../data/datasources/MockDataSource';

const arModelRepo = new ARModelRepositoryImpl();
const resolveARModelUseCase = new ResolveARModelUseCase(arModelRepo);

interface UseARScannerOptions {
  labId: string;
  autoScan?: boolean;
}

export const useARScanner = ({ labId, autoScan = true }: UseARScannerOptions) => {
  const {
    status,
    currentModel,
    scanTipVisible,
    errorMessage,
    setStatus,
    setModel,
    setErrorMessage,
    hideScanTip,
    initSession,
    addScanResult,
    resetSession,
  } = useARScannerStore();

  const isMounted = useRef(true);

  // ─── Inicializar sessão de RA ──────────────────────────

  const initialize = useCallback(async () => {
    setStatus('initializing');

    const permResult = await cameraService.requestCameraPermission();

    if (!isMounted.current) return;

    if (permResult === 'denied' || permResult === 'unavailable') {
      setStatus('camera_permission_denied');
      setErrorMessage(
        permResult === 'denied'
          ? 'Permissão de câmera negada. Conceda acesso em Configurações > Privacidade > Câmera.'
          : 'A câmera está indisponível neste dispositivo.',
      );
      if (permResult === 'unavailable') {
        cameraService.showCameraUnavailableAlert();
      }
      return;
    }

    initSession(labId);
    setStatus('scanning');
  }, [labId, setStatus, setErrorMessage, initSession]);

  // ─── Varredura de marcador ─────────────────────────────

  const scanForMarker = useCallback(async () => {
    if (status !== 'scanning') return;

    const lab = MOCK_LABORATORIES.find((l) => l.id === labId);
    const availableMarkers = lab?.arMarkerId ? [lab.arMarkerId] : [];

    const { markerId, confidence } = await cameraService.simulateMarkerDetection(availableMarkers);

    if (!isMounted.current) return;

    const result = {
      markerId,
      confidence,
      timestamp: new Date(),
    };
    addScanResult(result);

    if (markerId) {
      setStatus('model_loading');
      try {
        const model = await resolveARModelUseCase.execute(markerId);
        if (isMounted.current) {
          setModel(model);
        }
      } catch (err) {
        if (isMounted.current) {
          setErrorMessage('Erro ao carregar o modelo 3D. Tente novamente.');
        }
      }
    }
  }, [status, labId, addScanResult, setStatus, setModel, setErrorMessage]);

  // ─── Retry / Reset ─────────────────────────────────────

  const retry = useCallback(() => {
    resetSession();
    initialize();
  }, [resetSession, initialize]);

  const clearModel = useCallback(() => {
    setModel(null);
    setStatus('scanning');
  }, [setModel, setStatus]);

  // ─── Effects ───────────────────────────────────────────

  useEffect(() => {
    initialize();
    return () => {
      isMounted.current = false;
      resetSession();
    };
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (autoScan && status === 'scanning') {
      scanForMarker();
    }
  }, [autoScan, status, scanForMarker]);

  return {
    status,
    currentModel,
    scanTipVisible,
    errorMessage,
    hideScanTip,
    scanForMarker,
    retry,
    clearModel,
  };
};
