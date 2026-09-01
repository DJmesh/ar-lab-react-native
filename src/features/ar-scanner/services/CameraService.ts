/**
 * Feature: AR Scanner — CameraService
 *
 * @description Serviço de câmera usando expo-camera para compatibilidade com Expo Go.
 * Isola toda a lógica de hardware do restante da aplicação.
 */
import { Alert } from 'react-native';
import { Camera, type PermissionResponse } from 'expo-camera';

export type PermissionResult = 'granted' | 'denied' | 'unavailable';

export class CameraService {
  /**
   * Solicita permissão de câmera via Expo Camera API.
   * Funciona tanto no Expo Go quanto em builds nativas (iOS / Android).
   */
  async requestCameraPermission(): Promise<PermissionResult> {
    try {
      const { status }: PermissionResponse =
        await Camera.requestCameraPermissionsAsync();

      if (status === 'granted') return 'granted';
      if (status === 'denied')  return 'denied';

      // 'undetermined' ou qualquer outro estado
      return 'unavailable';
    } catch {
      // Câmera não disponível no dispositivo/simulador
      return 'unavailable';
    }
  }

  /**
   * Verifica se a permissão já foi concedida (sem mostrar dialog).
   */
  async checkCameraPermission(): Promise<PermissionResult> {
    try {
      const { status }: PermissionResponse =
        await Camera.getCameraPermissionsAsync();

      if (status === 'granted') return 'granted';
      if (status === 'denied')  return 'denied';
      return 'unavailable';
    } catch {
      return 'unavailable';
    }
  }

  /**
   * Simula detecção de marcador AR (dev/mock).
   * Em produção: substituir por VisionCamera Frame Processors com ML Kit.
   *
   * @param availableMarkers - IDs dos marcadores esperados para o laboratório
   */
  async simulateMarkerDetection(
    availableMarkers: string[],
  ): Promise<{ markerId: string | null; confidence: number }> {
    // Simula latência realista de detecção (1.5 a 2.5 segundos)
    await new Promise<void>((resolve) =>
      setTimeout(resolve, 1500 + Math.random() * 1000),
    );

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
   * Exibe alerta nativo quando a câmera está indisponível.
   */
  showCameraUnavailableAlert(): void {
    Alert.alert(
      'Câmera indisponível',
      'Não foi possível acessar a câmera do dispositivo.\n\n' +
        'Verifique se outro aplicativo está usando a câmera ou ' +
        'acesse Configurações > Privacidade > Câmera para liberar o acesso.',
      [{ text: 'Entendido', style: 'default' }],
    );
  }
}

export const cameraService = new CameraService();
