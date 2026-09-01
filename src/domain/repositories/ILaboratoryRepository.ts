/**
 * Domain Layer — Repository Interfaces
 * @description Contratos (interfaces) que a camada de dados deve implementar.
 * Seguindo o Princípio da Inversão de Dependência (DIP).
 */

import type { Laboratory, LaboratoryStep, UserProgress } from '../entities/Laboratory';
import type { ARModel, ARScanResult } from '../entities/ARSession';

// ─────────────────────────────────────────────
// Repository: Laboratórios
// ─────────────────────────────────────────────

export interface ILaboratoryRepository {
  findAll(): Promise<Laboratory[]>;
  findById(id: string): Promise<Laboratory | null>;
  findByCategory(category: string): Promise<Laboratory[]>;
  getSteps(labId: string): Promise<LaboratoryStep[]>;
}

// ─────────────────────────────────────────────
// Repository: Progresso do Usuário
// ─────────────────────────────────────────────

export interface IProgressRepository {
  getProgress(userId: string, labId: string): Promise<UserProgress | null>;
  saveProgress(progress: UserProgress): Promise<void>;
  markStepComplete(userId: string, labId: string, stepId: string): Promise<void>;
}

// ─────────────────────────────────────────────
// Repository: Modelos de RA
// ─────────────────────────────────────────────

export interface IARModelRepository {
  findByMarkerId(markerId: string): Promise<ARModel | null>;
  findAll(): Promise<ARModel[]>;
  logScanResult(result: ARScanResult): Promise<void>;
}
