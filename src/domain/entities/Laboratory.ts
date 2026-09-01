/**
 * Domain Layer — Laboratory Entities
 * @description Entidades puras do domínio. Sem dependência de frameworks.
 */

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type LaboratoryCategory =
  | 'chemistry'
  | 'physics'
  | 'biology'
  | 'electronics'
  | 'mechanics';

export interface Laboratory {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: LaboratoryCategory;
  readonly difficulty: DifficultyLevel;
  readonly estimatedDuration: number; // em minutos
  readonly thumbnailUrl: string;
  readonly arMarkerId?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface LaboratoryStep {
  readonly id: string;
  readonly labId: string;
  readonly order: number;
  readonly title: string;
  readonly description: string;
  readonly modelPath?: string;
  readonly imageUrl?: string;
  readonly safetyWarning?: string;
  readonly completionCriteria?: string;
}

export interface UserProgress {
  readonly userId: string;
  readonly labId: string;
  readonly completedSteps: string[];
  readonly currentStepId: string | null;
  readonly startedAt: Date;
  readonly completedAt: Date | null;
  readonly score: number;
}
