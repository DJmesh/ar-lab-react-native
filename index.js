/**
 * AR-Lab Mobile — Expo Entry Point
 * @description Com "main": "expo/AppEntry" no package.json, este arquivo
 * não é necessário. O Expo usa App.tsx diretamente como componente raiz.
 * Mantido por compatibilidade com fluxo bare se necessário no futuro.
 */
import { registerRootComponent } from 'expo';
import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up correctly.
registerRootComponent(App);
