/**
 * Domain Layer — AR (Augmented Reality) Entities
 * @description Tipos e entidades relacionadas à experiência de RA.
 */

export type ARStatus =
  | 'initializing'
  | 'camera_permission_denied'
  | 'camera_unavailable'
  | 'scanning'
  | 'marker_detected'
  | 'model_loading'
  | 'model_ready'
  | 'error';

export type ARModelType = 'molecule' | 'equipment' | 'anatomy' | 'geometry' | 'circuit';

export interface ARModel {
  readonly id: string;
  readonly name: string;
  readonly type: ARModelType;
  readonly filePath: string;     // caminho local .gltf/.obj
  readonly scale: [number, number, number];
  readonly rotation: [number, number, number];
  readonly position: [number, number, number];
  readonly description: string;
  readonly educationalTags: string[];
}

export interface ARScanResult {
  readonly markerId: string | null;
  readonly confidence: number;   // 0.0 a 1.0
  readonly timestamp: Date;
  readonly detectedModel?: ARModel;
}

export interface ARSession {
  readonly sessionId: string;
  readonly labId: string;
  readonly status: ARStatus;
  readonly currentModel: ARModel | null;
  readonly scanHistory: ARScanResult[];
  readonly startedAt: Date;
}
