/**
 * Sistema de Balizamento Marítimo IALA — Região B (Brasil e Américas).
 * O "sentido convencional do balizamento" é o de quem ENTRA no porto, vindo do mar.
 */

export type Bordo = 'boreste' | 'bombordo';
export const SENTIDOS = ['entrando', 'saindo'] as const;
export type Sentido = (typeof SENTIDOS)[number];

export interface MarcaLateral {
  /** bordo por onde a marca deve ser deixada por quem ENTRA */
  bordoEntrando: Bordo;
  cor: 'vermelha' | 'verde';
  formato: 'conico' | 'cilindrico';
  tope: 'cone-ponta-cima' | 'cilindro';
  corLuz: 'vermelha' | 'verde';
}

export const LATERAIS_REGIAO_B: Record<Bordo, MarcaLateral> = {
  boreste: { bordoEntrando: 'boreste', cor: 'vermelha', formato: 'conico', tope: 'cone-ponta-cima', corLuz: 'vermelha' },
  bombordo: { bordoEntrando: 'bombordo', cor: 'verde', formato: 'cilindrico', tope: 'cilindro', corLuz: 'verde' },
};

const oposto = (b: Bordo): Bordo => (b === 'boreste' ? 'bombordo' : 'boreste');

/** Por qual bordo deixar uma marca lateral de determinada cor, conforme o sentido. */
export function bordoParaDeixar(cor: MarcaLateral['cor'], sentido: Sentido): Bordo {
  const marca = cor === 'vermelha' ? LATERAIS_REGIAO_B.boreste : LATERAIS_REGIAO_B.bombordo;
  return sentido === 'entrando' ? marca.bordoEntrando : oposto(marca.bordoEntrando);
}
