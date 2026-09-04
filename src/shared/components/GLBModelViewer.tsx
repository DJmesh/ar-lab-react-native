/**
 * Component: GLBModelViewer
 * @description Renderizador WebGL 3D Real para arquivos binários .GLB/.GLTF:
 * Carrega e processa malhas 3D (.glb) com luzes PBR, sombras realistas, rotação 360° e zoom por pinça.
 */
import React, { useMemo } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { GLB_MODELS_BASE64 } from '../../assets/models/modelsBase64';

export type GLBModelKey = 'earth_globe' | 'apple_red' | 'apple_green';

interface GLBModelViewerProps {
  modelKey: GLBModelKey;
  autoRotate?: boolean;
  scale?: number;
  onRotationChange?: (rotYDeg: number) => void;
  style?: any;
}

export const GLBModelViewer: React.FC<GLBModelViewerProps> = ({
  modelKey,
  autoRotate = false,
  scale = 1.0,
  onRotationChange,
  style,
}) => {
  const modelB64 = GLB_MODELS_BASE64[modelKey];

  const htmlContent = useMemo(() => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: transparent !important;
    }
    model-viewer {
      width: 100%;
      height: 100%;
      background-color: transparent !important;
      --poster-color: transparent;
      --progress-bar-color: #38BDF8;
    }
  </style>
  <script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js"></script>
</head>
<body>
  <model-viewer
    id="viewer3d"
    src="${modelB64}"
    alt="Modelo 3D GLB Real"
    ${autoRotate ? 'auto-rotate auto-rotate-delay="0" rotation-per-second="20deg"' : ''}
    camera-controls
    touch-action="pan-y"
    shadow-intensity="2"
    shadow-softness="0.8"
    exposure="1.3"
    environment-image="neutral"
    interaction-prompt="none"
    scale="${scale} ${scale} ${scale}"
  ></model-viewer>

  <script>
    const viewer = document.getElementById('viewer3d');
    
    // Captura rotação em tempo real para acionar continentes da gincana
    if (viewer) {
      viewer.addEventListener('camera-change', () => {
        const orbit = viewer.getCameraOrbit();
        // Converte radianos de theta para graus (0 a 360)
        let deg = (orbit.theta * 180 / Math.PI) % 360;
        if (deg < 0) deg += 360;
        
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'rotation',
          deg: Math.round(deg)
        }));
      });
    }
  </script>
</body>
</html>
    `;
  }, [modelB64, autoRotate, scale]);

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'rotation' && onRotationChange) {
        onRotationChange(data.deg);
      }
    } catch (e) {
      // ignore non-json messages
    }
  };

  return (
    <View style={[styles.container, style]}>
      <WebView
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        style={styles.webview}
        transparent={true}
        backgroundColor="transparent"
        opaque={false}
        scrollEnabled={false}
        onMessage={handleMessage}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#38BDF8" />
          </View>
        )}
        startInLoadingState={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});
