/**
 * AR-Lab Mobile — Entry Point
 * @description Ponto de entrada da aplicação. Registra o componente raiz.
 */
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
