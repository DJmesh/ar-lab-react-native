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
    id: 'lab-kids-math',
    name: 'Contando Frutas Mágicas (1, 2, 3)',
    description:
      'Aponte a câmera para a mesa e conte as maçãs 3D flutuantes! Aprenda a somar de forma divertida estilo Pokémon GO.',
    category: 'math',
    difficulty: 'beginner',
    estimatedDuration: 5,
    thumbnailUrl: 'https://img.freepik.com/free-vector/hand-drawn-childlike-numbers-collection_23-2149845347.jpg',
    arMarkerId: 'marker-math',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
  {
    id: 'lab-kids-geo',
    name: 'Planeta Terra & Animais 🌍',
    description:
      'Gire o globo terrestre 3D no seu quarto e descubra onde os animais vivem no nosso planeta!',
    category: 'geography',
    difficulty: 'beginner',
    estimatedDuration: 5,
    thumbnailUrl: 'https://img.freepik.com/free-vector/earth-globe-cartoon-style_1308-124976.jpg',
    arMarkerId: 'marker-geo',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
  {
    id: 'lab-kids-port',
    name: 'Letra A de Abelha e B de Bola 🔤',
    description:
      'Encontre as letras mágicas 3D no ar e conecte cada letra ao objeto correspondente!',
    category: 'portuguese',
    difficulty: 'beginner',
    estimatedDuration: 5,
    thumbnailUrl: 'https://img.freepik.com/free-vector/alphabet-letter-blocks-cartoon_1308-11234.jpg',
    arMarkerId: 'marker-port',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
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
    id: 'model-math',
    name: '3 Maçãs Douradas (Matemática Infantil)',
    type: 'geometry',
    filePath: 'assets/models/apples_3d.glb',
    scale: [0.2, 0.2, 0.2],
    rotation: [0, 0, 0],
    position: [0, -0.2, -0.5],
    description: 'Três maçãs 3D flutuantes no mundo real estilo Pokémon GO para aprender a contar!',
    educationalTags: ['matemática pré-zinho', 'contagem', 'adição fácil'],
  },
  {
    id: 'model-geo',
    name: 'Globo Terrestre Interativo',
    type: 'geometry',
    filePath: 'assets/models/earth_globe.glb',
    scale: [0.3, 0.3, 0.3],
    rotation: [0, 15, 0],
    position: [0, 0, -0.6],
    description: 'Globo 3D do Planeta Terra girando em tempo real na sua frente!',
    educationalTags: ['geografia infantil', 'continentes', 'planeta terra'],
  },
  {
    id: 'model-port',
    name: 'Letra A 3D + Abelha Mágica',
    type: 'geometry',
    filePath: 'assets/models/letter_a.glb',
    scale: [0.25, 0.25, 0.25],
    rotation: [0, 0, 0],
    position: [0, 0, -0.5],
    description: 'Letra A tridimensional amarela com abelhinha animada flutuando ao redor!',
    educationalTags: ['português pré-zinho', 'alfabeto', 'vogais'],
  },
  {
    id: 'model-h2o',
    name: 'Molécula H₂O',
    type: 'molecule',
    filePath: 'assets/models/h2o_molecule.glb',
    scale: [0.1, 0.1, 0.1],
    rotation: [0, 0, 0],
    position: [0, 0, -0.5],
    description: 'Modelo 3D da molécula de água com esferas de van der Waals.',
    educationalTags: ['química', 'ligação covalente', 'polaridade'],
  },
];

// Mapa de marcadores → modelos
export const MARKER_TO_MODEL_MAP: Record<string, string> = {
  'marker-math': 'model-math',
  'marker-geo': 'model-geo',
  'marker-port': 'model-port',
  'marker-h2o': 'model-h2o',
  'marker-dna': 'model-dna',
};
