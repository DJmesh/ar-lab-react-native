/**
 * Feature: AR Scanner — Store (Zustand)
 * @description Estado global da sessão de Realidade Aumentada.
 */
import { create } from 'zustand';
import type { ARStatus, ARModel, ARSession, ARScanResult } from '../../../domain/entities/ARSession';

interface ARScannerState {
  status: ARStatus;
  currentModel: ARModel | null;
  session: ARSession | null;
  scanTipVisible: boolean;
  errorMessage: string | null;

  // Actions
  setStatus: (status: ARStatus) => void;
  setModel: (model: ARModel | null) => void;
  setErrorMessage: (msg: string | null) => void;
  hideScanTip: () => void;
  initSession: (labId: string) => void;
  addScanResult: (result: ARScanResult) => void;
  resetSession: () => void;
}

export const useARScannerStore = create<ARScannerState>((set, get) => ({
  status: 'initializing',
  currentModel: null,
  session: null,
  scanTipVisible: true,
  errorMessage: null,

  setStatus: (status) => set({ status }),

  setModel: (model) =>
    set({
      currentModel: model,
      status: model ? 'model_ready' : 'scanning',
    }),

  setErrorMessage: (errorMessage) =>
    set({ errorMessage, status: errorMessage ? 'error' : get().status }),

  hideScanTip: () => set({ scanTipVisible: false }),

  initSession: (labId) => {
    const session: ARSession = {
      sessionId: `session-${Date.now()}`,
      labId,
      status: 'scanning',
      currentModel: null,
      scanHistory: [],
      startedAt: new Date(),
    };
    set({ session, status: 'scanning' });
  },

  addScanResult: (result) => {
    const session = get().session;
    if (!session) return;
    set({
      session: {
        ...session,
        scanHistory: [...session.scanHistory, result],
      },
    });
  },

  resetSession: () =>
    set({
      status: 'initializing',
      currentModel: null,
      session: null,
      scanTipVisible: true,
      errorMessage: null,
    }),
}));
