import type { ReactNode } from 'react';
import type { Ponto } from './geometria';

/*
 * Catálogo de nós. Cada cabo é uma lista de pontos [x, y, z]; nos cruzamentos,
 * quem tem z MAIOR passa por cima. Com `objeto` (cunho, balaústre), z < 0 fica atrás/embaixo dele.
 * Coordenadas no viewBox 400×260.
 */

export type NoId = 'oito' | 'direito' | 'escota' | 'lais-de-guia' | 'volta-do-fiel' | 'volta-de-cunho';

export interface NoDef {
  nome: string;
  cabos: { pontos: Ponto[]; cor?: number }[];
  fundo?: ReactNode;
  objeto?: ReactNode;
  rotulos?: [x: number, y: number, texto: string, anc?: 'start' | 'middle' | 'end'][];
}

const INK = '#0B1F3F';

const CUNHO = (
  <g>
    <ellipse cx="200" cy="133" rx="38" ry="14" fill="#7A8699" stroke={INK} strokeWidth="3" />
    <path d="M118,130 Q118,118 135,118 L265,118 Q282,118 282,130 Q282,142 265,142 L135,142 Q118,142 118,130Z" fill="#B9C3D1" stroke={INK} strokeWidth="3.5" />
    <path d="M135,124 L265,124" stroke="#fff" strokeWidth="3" opacity=".6" strokeLinecap="round" />
  </g>
);

const BALAUSTRE_FUNDO = (
  <g>
    <rect x="0" y="150" width="400" height="110" fill="#E9EEF5" />
    <path d="M0,150 L400,150" stroke={INK} strokeWidth="3" />
    <rect x="60" y="100" width="10" height="54" fill="#B9C3D1" stroke={INK} strokeWidth="2.5" />
    <rect x="330" y="100" width="10" height="54" fill="#B9C3D1" stroke={INK} strokeWidth="2.5" />
    {/* defensa pendurada */}
    <rect x="137" y="200" width="46" height="56" rx="20" fill="#1765D8" stroke={INK} strokeWidth="3" />
    <path d="M145,214 L175,214 M145,242 L175,242" stroke="#fff" strokeWidth="3" opacity=".5" />
  </g>
);
const BALAUSTRE = (
  <g>
    <rect x="10" y="68" width="380" height="42" rx="21" fill="#C9D2DE" stroke={INK} strokeWidth="3.5" />
    <path d="M28,78 L372,78" stroke="#fff" strokeWidth="5" opacity=".7" strokeLinecap="round" />
  </g>
);

export const NOS: Record<NoId, NoDef> = {
  oito: {
    nome: 'Nó de oito',
    cabos: [
      {
        pontos: [
          [20, 175, 0], [70, 175, 1], [150, 176, -1], [215, 175, 0], [258, 150, 0], [266, 128, 1],
          [250, 78, 0], [205, 55, 0], [160, 72, 0], [154, 128, -1], [150, 174, 1], [135, 215, 0],
          [95, 228, 0], [62, 205, 0], [70, 175, -1], [85, 135, 0], [154, 128, 1], [210, 122, 0],
          [266, 128, -1], [320, 135, 0], [385, 118, 0],
        ],
      },
    ],
    rotulos: [[30, 160, 'FIRME', 'start'], [380, 105, 'CHICOTE', 'end']],
  },

  direito: {
    nome: 'Nó direito',
    cabos: [
      {
        pontos: [
          [15, 85, 0], [70, 85, 0], [112, 85, 1], [136, 85, 0], [160, 85, -1], [200, 85, 0], [240, 86, 0],
          [270, 98, 0], [284, 110, 1], [290, 130, 0], [284, 150, -1], [270, 162, 0], [240, 174, 0], [200, 175, 0],
          [160, 175, 1], [136, 175, 0], [112, 175, -1], [60, 175, 0],
        ],
      },
      {
        pontos: [
          [385, 110, 0], [320, 110, 0], [284, 110, -1], [220, 110, 0], [180, 104, 0], [160, 85, 1], [140, 63, 0],
          [118, 68, 0], [112, 85, -1], [100, 130, 0], [112, 175, 1], [118, 192, 0], [140, 197, 0], [160, 175, -1],
          [180, 156, 0], [220, 150, 0], [284, 150, 1], [335, 150, 0],
        ],
      },
    ],
  },

  escota: {
    nome: 'Nó de escota',
    cabos: [
      {
        // cabo mais grosso: forma o seio (a "alça" em U)
        pontos: [
          [15, 95, 0], [120, 95, 0], [170, 98, 0], [205, 108, 0], [222, 111, 1], [250, 112, -1], [270, 114, 0],
          [288, 130, 1], [270, 146, 0], [250, 148, -1], [222, 149, 1], [205, 152, 0], [170, 162, 0], [130, 165, 0],
          [95, 165, 0],
        ],
      },
      {
        // cabo mais fino: passa pelo seio, dá a volta por trás do pescoço e morde a si mesmo
        pontos: [
          [385, 130, 0], [325, 130, 0], [288, 130, -1], [266, 128, 0.7], [254, 122, 0.8], [250, 112, 1],
          [244, 86, 0], [226, 82, 0], [222, 111, -1], [222, 149, -1], [227, 176, 0], [245, 176, 0], [250, 148, 1],
          [258, 134, -0.6], [266, 120, 0],
        ],
      },
    ],
  },

  'lais-de-guia': {
    nome: 'Lais de guia',
    cabos: [
      {
        pontos: [
          [200, 4, 0], [200, 30, 1], [200, 52, -1], [200, 82, -1], [206, 118, 0], [236, 136, 0], [268, 118, 0],
          [270, 82, 0], [240, 64, 0], [200, 82, 1], [168, 94, 0], [140, 135, 0], [130, 190, 0], [160, 240, 0],
          [215, 252, 0], [265, 232, 0], [282, 185, 0], [264, 150, 0], [250, 131, -1], [250, 100, 0], [252, 70, 1],
          [238, 38, 0], [200, 28, -1], [170, 26, 0], [156, 42, 0], [170, 58, 0], [200, 55, 1], [222, 73, 1], [224, 100, 0],
          [222, 128, -1], [218, 165, 0], [214, 195, 0],
        ],
      },
    ],
    rotulos: [[160, 200, 'ALÇA FIXA', 'end'], [208, 14, 'FIRME', 'start']],
  },

  'volta-do-fiel': {
    nome: 'Volta do fiel',
    fundo: BALAUSTRE_FUNDO,
    objeto: BALAUSTRE,
    cabos: [
      {
        pontos: [
          [160, 205, 0], [160, 150, 0], [161, 118, -0.4], [163, 96, -1.2], [166, 74, -1], [172, 60, 0], [184, 68, 1.2],
          [205, 86, 2], [232, 102, 1.5], [246, 118, 0], [252, 98, -1.2], [242, 74, -1.2], [228, 60, 0], [221, 72, 1.1],
          [220, 98, 1], [219, 122, 0], [218, 165, 0],
        ],
      },
    ],
  },

  'volta-de-cunho': {
    nome: 'Volta de cunho',
    objeto: CUNHO,
    cabos: [
      {
        pontos: [
          [20, 215, 0], [120, 188, 0], [215, 162, 0], [255, 146, 0], [268, 128, -1], [258, 106, 0], [235, 102, 0.5],
          [200, 130, 1], [165, 157, 0.5], [140, 153, 0], [132, 130, -1], [142, 107, 0], [165, 103, 0.5],
          [200, 130, 2], [235, 157, 0.8], [262, 158, 0.5], [281, 134, 1.2], [270, 104, 0.6], [248, 114, 0.4],
          [240, 136, 0.2], [232, 160, -0.2],
        ],
      },
    ],
  },
};
