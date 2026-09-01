/**
 * Domain Layer — Use Cases (Application Business Rules)
 * @description Casos de uso: orquestram entidades e chamam repositórios.
 */

import type { ILaboratoryRepository } from '../repositories/ILaboratoryRepository';
import type { IARModelRepository } from '../repositories/ILaboratoryRepository';
import type { IProgressRepository } from '../repositories/ILaboratoryRepository';
import type { Laboratory } from '../entities/Laboratory';
import type { ARModel } from '../entities/ARSession';

// ─────────────────────────────────────────────
// Use Case: Listar Laboratórios
// ─────────────────────────────────────────────

export class GetLaboratoriesUseCase {
  constructor(private readonly labRepository: ILaboratoryRepository) {}

  async execute(category?: string): Promise<Laboratory[]> {
    if (category) {
      return this.labRepository.findByCategory(category);
    }
    return this.labRepository.findAll();
  }
}

// ─────────────────────────────────────────────
// Use Case: Resolver Modelo de RA por Marcador
// ─────────────────────────────────────────────

export class ResolveARModelUseCase {
  constructor(private readonly arModelRepository: IARModelRepository) {}

  async execute(markerId: string): Promise<ARModel | null> {
    if (!markerId || markerId.trim() === '') {
      return null;
    }
    return this.arModelRepository.findByMarkerId(markerId);
  }
}

// ─────────────────────────────────────────────
// Use Case: Marcar Etapa Concluída
// ─────────────────────────────────────────────

export class CompleteStepUseCase {
  constructor(private readonly progressRepository: IProgressRepository) {}

  async execute(userId: string, labId: string, stepId: string): Promise<void> {
    await this.progressRepository.markStepComplete(userId, labId, stepId);
  }
}
