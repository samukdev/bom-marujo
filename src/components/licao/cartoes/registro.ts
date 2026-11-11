'use client';

import type { Cartao, CartaoDe, TipoCartao } from '@/content';
import { conceito } from './Conceito';
import { multiplaEscolha } from './MultiplaEscolha';
import type { TipoDeCartao } from './tipos';

/**
 * Um componente por tipo de cartão. O banco guarda `{ tipo, ...conteúdo }`;
 * criar um tipo novo = schema em content/schema.ts + um módulo aqui (o TypeScript cobra as duas).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TIPOS_DE_CARTAO: { [T in TipoCartao]: TipoDeCartao<CartaoDe<T>, any> } = {
  conceito,
  'multipla-escolha': multiplaEscolha,
};

/** O tipo do cartão, sem o tipo da resposta (o player guarda a resposta como `unknown`). */
export function tipoDe(c: Cartao): TipoDeCartao<Cartao, unknown> {
  return TIPOS_DE_CARTAO[c.tipo] as unknown as TipoDeCartao<Cartao, unknown>;
}

export const ehAvaliativo = (c: Cartao) => tipoDe(c).avaliativo;
