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
  /** largura = bitola do cabo em px (padrão 12) */
  cabos: { pontos: Ponto[]; cor?: number; largura?: number }[];
  fundo?: ReactNode;
  objeto?: ReactNode;
  /** contorno do objeto (path d): trechos de baixo dos remendos só aparecem fora dele */
  silhueta?: string;
  rotulos?: [x: number, y: number, texto: string, anc?: 'start' | 'middle' | 'end', alvo?: [number, number]][];
}

const INK = '#0B1F3F';

/** Cunho visto de cima: orelhas (as pontas) longas, pedestal no meio. */
const CUNHO_FUNDO = (
  <g>
    <rect x="0" y="0" width="400" height="260" fill="#C9B79A" />
    {Array.from({ length: 7 }, (_, i) => (
      <path key={i} d={`M0,${18 + i * 38} L400,${18 + i * 38}`} stroke="#A99474" strokeWidth="2" />
    ))}
    <ellipse cx="200" cy="138" rx="58" ry="26" fill="#7A8699" stroke={INK} strokeWidth="3" opacity=".9" />
  </g>
);
const CUNHO_D =
  'M100,130 C100,114 116,110 140,114 L170,120 Q200,124 230,120 L260,114 C284,110 300,114 300,130 C300,146 284,150 260,146 L230,140 Q200,136 170,140 L140,146 C116,150 100,146 100,130Z';
const BALAUSTRE_D = 'M31,68 H369 A21,21 0 0 1 369,110 H31 A21,21 0 0 1 31,68 Z';
const CUNHO = (
  <g>
    <path d={CUNHO_D} fill="#B9C3D1" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
    <path d="M118,124 C140,118 160,124 200,128 C240,124 260,118 282,124" fill="none" stroke="#fff" strokeWidth="3" opacity=".65" strokeLinecap="round" />
  </g>
);

const BALAUSTRE_FUNDO = (
  <g>
    <rect x="0" y="150" width="400" height="110" fill="#E9EEF5" />
    <path d="M0,150 L400,150" stroke={INK} strokeWidth="3" />
    <rect x="60" y="100" width="10" height="54" fill="#B9C3D1" stroke={INK} strokeWidth="2.5" />
    <rect x="330" y="100" width="10" height="54" fill="#B9C3D1" stroke={INK} strokeWidth="2.5" />
    {/* defensa pendurada */}
    <rect x="151" y="200" width="46" height="56" rx="20" fill="#1765D8" stroke={INK} strokeWidth="3" />
    <path d="M159,214 L189,214 M159,242 L189,242" stroke="#fff" strokeWidth="3" opacity=".5" />
  </g>
);
const BALAUSTRE = (
  <g>
    <path d={BALAUSTRE_D} fill="#C9D2DE" stroke={INK} strokeWidth="3.5" />
    <path d="M28,78 L372,78" stroke="#fff" strokeWidth="5" opacity=".7" strokeLinecap="round" />
  </g>
);

export const NOS: Record<NoId, NoDef> = {
  oito: {
    nome: 'Nó de oito',
    cabos: [
      {
        pontos: [
          [-24, 175, 0], [70, 175, 1], [150, 176, -1], [215, 175, 0], [258, 150, 0], [266, 128, 1],
          [250, 78, 0], [205, 55, 0], [160, 72, 0], [154, 128, -1], [150, 174, 1], [135, 215, 0],
          [95, 228, 0], [62, 205, 0], [70, 175, -1], [85, 135, 0], [154, 128, 1], [210, 122, 0],
          [266, 128, -1], [320, 135, 0], [385, 118, 0],
        ],
      },
    ],
    rotulos: [[22, 240, 'FIRME', 'start', [40, 176]], [384, 80, 'CHICOTE', 'end', [352, 125]]],
  },

  direito: {
    nome: 'Nó direito',
    cabos: [
      {
        // Nó DIREITO (e não torto): as duas pernas de cada cabo passam do MESMO lado do seio do outro.
        // Conferido pelo writhe do fecho = 0 (o torto dá ±6). Ver topologia.test.ts.
        pontos: [
          [15, 85, 0], [70, 85, 0], [112, 85, 1], [136, 85, 0], [160, 85, -1], [200, 85, 0], [240, 86, 0],
          [270, 98, 0], [284, 110, 1], [290, 130, 0], [284, 150, 1], [270, 162, 0], [240, 174, 0], [200, 175, 0],
          [160, 175, -1], [136, 175, 0], [112, 175, 1], [60, 175, 0],
        ],
      },
      {
        pontos: [
          [385, 110, 0], [320, 110, 0], [284, 110, -1], [220, 110, 0], [180, 104, 0], [160, 85, 1], [140, 63, 0],
          [118, 68, 0], [112, 85, -1], [100, 130, 0], [112, 175, -1], [118, 192, 0], [140, 197, 0], [160, 175, 1],
          [180, 156, 0], [220, 150, 0], [284, 150, -1], [335, 150, 0],
        ],
      },
    ],
  },

  escota: {
    nome: 'Nó de escota',
    cabos: [
      {
        // cabo mais grosso: forma o seio (a "alça" em U)
        // firme = perna de BAIXO (longa); chicote = perna de cima (curta) — assim o chicote do cabo fino
        // termina do MESMO lado do chicote do grosso (escota "destra"; do lado oposto seria a canhota)
        largura: 18, // o cabo GROSSO é o que forma o seio
        pontos: [
          [15, 172, 0], [130, 170, 0], [172, 162, 0], [205, 156, 1], [226, 157, -1], [266, 160, 0], [302, 128, 1],
          [266, 98, 0], [232, 103, -1], [205, 104, 1], [172, 98, 0], [120, 90, 0], [95, 88, 0],
        ],
      },
      {
        // cabo mais fino: entra no seio por trás, abraça o pescoço (por cima, por trás das duas pernas,
        // de novo por cima) e morde a si mesmo — o chicote fica preso entre ele e o seio
        pontos: [
          [385, 138, 0], [330, 138, 0], [302, 138, -1], [266, 140, 1.4], [244, 132, 1], [232, 103, 1],
          [226, 78, 0], [210, 76, 0], [205, 104, -1], [205, 156, -1], [210, 182, 0], [222, 182, 0], [226, 157, 1],
          [240, 150, 0.2], [258, 145, -0.6], [265, 130, 0], [270, 117, 0],
        ],
      },
    ],
  },

  'lais-de-guia': {
    nome: 'Lais de guia',
    cabos: [
      {
        pontos: [
          [266, -14, 0], [258, 14, 0.3], [242, 38, 0.6], [236, 56, 1], [236, 76, -1], [236, 102, -1], [241, 134, 0], [268, 150, 0], [296, 134, 0],
          [298, 102, 0], [271, 86, 0], [236, 102, 1], [208, 113, 0], [183, 149, 0], [174, 197, 0], [201, 241, 0],
          [249, 252, 0], [293, 234, 0], [308, 193, 0], [292, 162, 0], [280, 145, -1], [280, 118, 0], [282, 92, 1],
          [269, 63, 0], [236, 54, -1], [206, 49, 0], [188, 63, 0], [194, 81, 0], [215, 86, 0.6], [236, 80, 1], [255, 94, 1.6], [257, 118, 0],
          [255, 143, -1], [252, 175, 0], [248, 202, 0],
        ],
      },
    ],
    rotulos: [[150, 232, 'ALÇA FIXA', 'end', [176, 214]], [284, 38, 'FIRME', 'start', [258, 16]]],
  },

  'volta-do-fiel': {
    nome: 'Volta do fiel',
    fundo: BALAUSTRE_FUNDO,
    objeto: BALAUSTRE,
    silhueta: BALAUSTRE_D,
    cabos: [
      {
        // Volta do fiel: duas voltas no mesmo sentido; a diagonal (o "cavaleiro") passa POR CIMA das DUAS pontas,
        // que saem em direções opostas (firme para baixo, até a defensa; chicote para cima).
        // Passagens trás↔frente sempre FORA da silhueta do balaústre (y < 58 em cima, y > 120 embaixo).
        pontos: [
          // As duas pontas saem LADO A LADO no meio, entre as duas voltas, por baixo do cavaleiro e sem se cruzar.
          // firme sobe pela FRENTE do balaústre no meio (por baixo do cavaleiro) e passa por cima dele
          [174, 205, 0], [174, 150, 0.3], [174, 118, 0.6], [175, 92, 0.6], [177, 66, 0.6], [183, 50, 0],
          // volta da DIREITA: desce por trás e faz um "U" visível embaixo do balaústre
          [194, 66, -1], [206, 96, -1], [212, 122, -0.6], [226, 140, 0], [242, 128, 0.5],
          // cavaleiro: sobe pela frente em diagonal para a esquerda, por cima do firme e do chicote
          [236, 114, 1.6], [176, 86, 1.6], [130, 64, 0.8], [116, 50, 0.2], [106, 46, 0], [96, 54, -0.4],
          // volta da ESQUERDA: desce por trás e faz um "U" visível embaixo
          [100, 78, -1], [118, 102, -1], [128, 122, -0.4], [138, 138, 0], [148, 130, 0.4],
          // chicote sobe pela frente no meio, à esquerda do firme, preso por baixo do cavaleiro
          [151, 112, 0.6], [152, 88, 0.6], [153, 64, 0.6], [154, 46, 0.3],
        ],
      },
    ],
  },

  'volta-de-cunho': {
    nome: 'Volta de cunho',
    fundo: CUNHO_FUNDO,
    objeto: CUNHO,
    silhueta: CUNHO_D,
    cabos: [
      {
        // vem do barco (embaixo à esquerda) → por baixo da orelha mais distante → X por cima do centro
        // → por baixo da outra orelha → cote final por cima da orelha, chicote deitado sobre o cunho
        pontos: [
          // vem do barco (embaixo à esquerda)
          [18, 236, 0], [120, 212, 0], [212, 188, 0], [240, 176, -0.3],
          // 1) VOLTA REDONDA na base: por baixo da orelha mais distante (direita), em volta do pé, por baixo da esquerda
          [262, 158, -1], [268, 134, -1], [258, 112, -1], [228, 106, -1], [200, 105, -1], [170, 107, -1],
          [140, 116, -1], [132, 142, -1], [146, 164, -1], [166, 168, -0.3],
          // 2) COTES EM OITO: 1ª diagonal por cima do centro, por baixo da orelha direita, 2ª diagonal (fecha o X)
          [182, 154, 0.6], [200, 130, 1.2], [224, 104, 0.8], [250, 94, 0.3], [276, 102, -0.5], [292, 124, -1],
          [290, 148, -1], [270, 160, 0.2], [242, 156, 0.9], [200, 130, 2], [162, 100, 0.9], [136, 90, 0.3],
          // 3) COTE MORDIDO: por baixo da orelha esquerda e o chicote volta POR BAIXO do trecho que acabou de chegar;
          //    a ponta sai para o convés, logo além da orelha
          [114, 104, -0.6], [106, 128, -1], [114, 152, -0.6], [134, 162, 0.3], [146, 140, 0.5], [150, 116, 0.5],
          [152, 96, -0.4], [164, 82, 0], [182, 78, 0],
        ],
      },
    ],
  },
};
