/**
 * Navigation — Root Navigator
 * @description Configuração principal do navegador da aplicação.
 */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../features/laboratory/screens/HomeScreen';
import { LabDetailScreen } from '../features/laboratory/screens/LabDetailScreen';
import { ARViewerScreen } from '../features/ar-scanner/screens/ARViewerScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: '#0A0E1A' },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="LabDetail" component={LabDetailScreen} />
      <Stack.Screen
        name="ARViewer"
        component={ARViewerScreen}
        options={{
          animation: 'fade',
          orientation: 'portrait',
        }}
      />
    </Stack.Navigator>
  );
};
