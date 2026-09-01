/**
 * Data Layer — Laboratory Repository Implementation
 * @description Implementação concreta do repositório de laboratórios.
 */

import type {
  ILaboratoryRepository,
  IARModelRepository,
} from '../../domain/repositories/ILaboratoryRepository';
import type { Laboratory, LaboratoryStep } from '../../domain/entities/Laboratory';
import type { ARModel, ARScanResult } from '../../domain/entities/ARSession';
import {
  MOCK_LABORATORIES,
  MOCK_LAB_STEPS,
  MOCK_AR_MODELS,
  MARKER_TO_MODEL_MAP,
} from '../datasources/MockDataSource';

// ─────────────────────────────────────────────
// Implementação: Laboratórios
// ─────────────────────────────────────────────

export class LaboratoryRepositoryImpl implements ILaboratoryRepository {
  async findAll(): Promise<Laboratory[]> {
    // Simula latência de rede
    await this.simulateNetworkDelay(300);
    return MOCK_LABORATORIES;
  }

  async findById(id: string): Promise<Laboratory | null> {
    await this.simulateNetworkDelay(150);
    return MOCK_LABORATORIES.find((lab) => lab.id === id) ?? null;
  }

  async findByCategory(category: string): Promise<Laboratory[]> {
    await this.simulateNetworkDelay(200);
    return MOCK_LABORATORIES.filter((lab) => lab.category === category);
  }

  async getSteps(labId: string): Promise<LaboratoryStep[]> {
    await this.simulateNetworkDelay(200);
    return MOCK_LAB_STEPS[labId] ?? [];
  }

  private simulateNetworkDelay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// ─────────────────────────────────────────────
// Implementação: Modelos de RA
// ─────────────────────────────────────────────

export class ARModelRepositoryImpl implements IARModelRepository {
  async findByMarkerId(markerId: string): Promise<ARModel | null> {
    const modelId = MARKER_TO_MODEL_MAP[markerId];
    if (!modelId) {
      return null;
    }
    return MOCK_AR_MODELS.find((m) => m.id === modelId) ?? null;
  }

  async findAll(): Promise<ARModel[]> {
    return MOCK_AR_MODELS;
  }

  async logScanResult(_result: ARScanResult): Promise<void> {
    // Em produção, enviaria para analytics/backend
    console.debug('[ARModelRepository] Scan result logged:', _result.markerId);
  }
}
