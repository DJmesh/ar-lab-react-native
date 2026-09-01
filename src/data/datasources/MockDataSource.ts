/**
 * Data Layer — Mock Data Sources
 * @description Dados educacionais estáticos para desenvolvimento e testes.
 * Em produção, estes seriam substituídos por chamadas de API.
 */

import type { Laboratory, LaboratoryStep } from '../../domain/entities/Laboratory';
import type { ARModel } from '../../domain/entities/ARSession';

// ─────────────────────────────────────────────
// Mock: Laboratórios Disponíveis
// ─────────────────────────────────────────────

export const MOCK_LABORATORIES: Laboratory[] = [
  {
    id: 'lab-001',
    name: 'Molécula de Água (H₂O)',
    description:
      'Explore a estrutura tridimensional da molécula de água e entenda as ligações covalentes entre hidrogênio e oxigênio.',
    category: 'chemistry',
    difficulty: 'beginner',
    estimatedDuration: 15,
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/H2O_2D_labelled.svg/200px-H2O_2D_labelled.svg.png',
    arMarkerId: 'marker-h2o',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  },
  {
    id: 'lab-002',
    name: 'DNA — Dupla Hélice',
    description:
      'Visualize em RA a estrutura completa do DNA com nucleotídeos, pares de bases e a famosa conformação em dupla hélice.',
    category: 'biology',
    difficulty: 'intermediate',
    estimatedDuration: 25,
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/DNA_replication_split.svg/200px-DNA_replication_split.svg.png',
    arMarkerId: 'marker-dna',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  },
  {
    id: 'lab-003',
    name: 'Circuito RLC em Série',
    description:
      'Examine um circuito elétrico com resistor, indutor e capacitor. Observe correntes e tensões em tempo real com RA.',
    category: 'electronics',
    difficulty: 'advanced',
    estimatedDuration: 30,
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/RLC_series_circuit_v1.svg/200px-RLC_series_circuit_v1.svg.png',
    arMarkerId: 'marker-rlc',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  },
  {
    id: 'lab-004',
    name: 'Cubo Geométrico — Sólidos de Platão',
    description:
      'Explore os cinco sólidos platônicos em 3D: tetraedro, cubo, octaedro, dodecaedro e icosaedro. Ideal para geometria espacial.',
    category: 'physics',
    difficulty: 'beginner',
    estimatedDuration: 10,
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Tetrahedron.png/200px-Tetrahedron.png',
    arMarkerId: 'marker-platonic',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  },
];

// ─────────────────────────────────────────────
// Mock: Etapas do Laboratório H₂O
// ─────────────────────────────────────────────

export const MOCK_LAB_STEPS: Record<string, LaboratoryStep[]> = {
  'lab-001': [
    {
      id: 'step-001-1',
      labId: 'lab-001',
      order: 1,
      title: 'Identificar os átomos',
      description:
        'Observe o modelo 3D. Identifique o átomo de oxigênio (vermelho) e os dois átomos de hidrogênio (branco).',
      safetyWarning: undefined,
    },
    {
      id: 'step-001-2',
      labId: 'lab-001',
      order: 2,
      title: 'Ângulo de ligação',
      description:
        'O ângulo de ligação H-O-H é aproximadamente 104,5°. Gire o modelo para observar a geometria angular.',
      completionCriteria: 'Rotacionar o modelo 360°',
    },
    {
      id: 'step-001-3',
      labId: 'lab-001',
      order: 3,
      title: 'Polaridade da molécula',
      description:
        'A distribuição desigual de cargas cria um dipolo elétrico. Observe as regiões δ+ e δ- no modelo.',
    },
  ],
};

// ─────────────────────────────────────────────
// Mock: Modelos de RA disponíveis
// ─────────────────────────────────────────────

export const MOCK_AR_MODELS: ARModel[] = [
  {
    id: 'model-h2o',
    name: 'Molécula H₂O',
    type: 'molecule',
    filePath: 'assets/models/h2o_molecule.glb',
    scale: [0.1, 0.1, 0.1],
    rotation: [0, 0, 0],
    position: [0, 0, -0.5],
    description: 'Modelo 3D da molécula de água com esferas de van der Waals.',
    educationalTags: ['química', 'ligação covalente', 'polaridade', 'geometria molecular'],
  },
  {
    id: 'model-dna',
    name: 'DNA Dupla Hélice',
    type: 'anatomy',
    filePath: 'assets/models/dna_helix.glb',
    scale: [0.05, 0.05, 0.05],
    rotation: [0, 0, 0],
    position: [0, 0, -0.8],
    description: 'Estrutura completa do DNA em dupla hélice com nucleotídeos coloridos.',
    educationalTags: ['biologia', 'genética', 'DNA', 'nucleotídeos'],
  },
  {
    id: 'model-cube',
    name: 'Cubo — Sólido de Platão',
    type: 'geometry',
    filePath: 'assets/models/cube_wireframe.glb',
    scale: [0.15, 0.15, 0.15],
    rotation: [45, 45, 0],
    position: [0, 0, -0.6],
    description: 'Cubo geométrico perfeito com arestas destacadas para análise espacial.',
    educationalTags: ['geometria', 'sólidos platônicos', 'matemática', 'volume'],
  },
];

// Mapa de marcadores → modelos
export const MARKER_TO_MODEL_MAP: Record<string, string> = {
  'marker-h2o': 'model-h2o',
  'marker-dna': 'model-dna',
  'marker-platonic': 'model-cube',
};
