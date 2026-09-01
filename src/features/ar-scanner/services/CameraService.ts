/**
 * Feature: AR Scanner — Service
 * @description Serviço de câmera: solicitação de permissão e detecção de marcadores.
 * Isola toda a lógica de hardware do restante do app.
 */
import { Platform, PermissionsAndroid, Alert } from 'react-native';

export type PermissionResult = 'granted' | 'denied' | 'unavailable';

export class CameraService {
  /**
   * Solicita permissão de câmera de forma platform-aware.
   */
  async requestCameraPermission(): Promise<PermissionResult> {
    if (Platform.OS === 'android') {
      try {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Permissão de Câmera — AR Lab',
            message:
              'O AR Lab precisa acessar sua câmera para projetar modelos de Realidade Aumentada no ambiente do laboratório.',
            buttonPositive: 'Permitir',
            buttonNegative: 'Negar',
            buttonNeutral: 'Perguntar depois',
          },
        );
        if (result === PermissionsAndroid.RESULTS.GRANTED) return 'granted';
        if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) return 'unavailable';
        return 'denied';
      } catch {
        return 'unavailable';
      }
    }

    // iOS — permissão gerenciada pelo Info.plist
    return 'granted';
  }

  /**
   * Simula detecção de marcador (substituir por lógica real de RA).
   * Em produção: integrar com ViroReact ou ML Kit.
   */
  async simulateMarkerDetection(
    availableMarkers: string[],
  ): Promise<{ markerId: string | null; confidence: number }> {
    await new Promise<void>((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000));

    // 70% de chance de detecção bem-sucedida
    if (Math.random() > 0.3 && availableMarkers.length > 0) {
      const idx = Math.floor(Math.random() * availableMarkers.length);
      return {
        markerId: availableMarkers[idx] ?? null,
        confidence: 0.7 + Math.random() * 0.3,
      };
    }

    return { markerId: null, confidence: 0 };
  }

  /**
   * Orienta o usuário quando a câmera está indisponível.
   */
  showCameraUnavailableAlert(): void {
    Alert.alert(
      'Câmera indisponível',
      'Não foi possível acessar a câmera do dispositivo. Verifique se outro aplicativo está usando a câmera ou se as permissões estão ativas em Configurações.',
      [{ text: 'Entendido', style: 'default' }],
    );
  }
}

export const cameraService = new CameraService();
