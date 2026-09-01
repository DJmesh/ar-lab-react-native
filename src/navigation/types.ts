/**
 * Navigation — Route Types
 * @description Tipagem de rotas para type-safe navigation.
 */

export type RootStackParamList = {
  Home: undefined;
  LabDetail: {
    labId: string;
    labName: string;
  };
  ARViewer: {
    labId: string;
    labName: string;
  };
};
