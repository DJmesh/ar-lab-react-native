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
    setStatus('model_loading');

    // Mapeamento direto de labId para markerId do modelo 3D
    const labMarkerMap: Record<string, string> = {
      'lab-math-1': 'marker-math',
      'lab-geo-1': 'marker-geo',
      'lab-port-1': 'marker-port',
      'lab-chem-1': 'marker-h2o',
    };

    const targetMarkerId = labMarkerMap[labId] || 'marker-math';

    try {
      const model = await resolveARModelUseCase.execute(targetMarkerId);
      if (isMounted.current) {
        setModel(model);
        setStatus('model_ready');
      }
    } catch (err) {
      if (isMounted.current) {
        setStatus('model_ready');
      }
    }
  }, [labId, setStatus, setErrorMessage, setModel, initSession]);

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

  return {
    status,
    currentModel,
    scanTipVisible,
    errorMessage,
    hideScanTip,
    retry,
    clearModel,
  };
};
