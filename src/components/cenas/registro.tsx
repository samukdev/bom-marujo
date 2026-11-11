'use client';

import type { ReactNode } from 'react';
import type { CenaSpec, TipoCena } from '@/content';
import { CenaBordos } from './CenaBordos';
import { CenaCanal } from './CenaCanal';
import { CenaEncontro } from './CenaEncontro';
import { CenaLuzesNoite } from './CenaLuzesNoite';
import { CenaMarcas } from './CenaMarcas';
import { CenaNo } from './CenaNo';

export interface EstadoApito {
  /** quantos apitos já soaram (muda a cada apito, para reiniciar a fumaça) */
  n: number;
  /** duração do apito atual em s (a fumaça dura o mesmo) */
  dur: number;
}

export interface PropsRenderizador<S> {
  spec: S;
  /** revelado e já montado: dispara as animações do "depois" */
  revelado: boolean;
  /** revelado como pedido pela tela (sem esperar a montagem) */
  pedido: boolean;
  apito?: EstadoApito;
}

export interface RenderizadorCena<S> {
  Desenho: (p: PropsRenderizador<S>) => ReactNode;
  /** a cena tem uma ação de 2,4 s: os rótulos só entram depois dela */
  temAcao: (spec: S) => boolean;
  /** mostra "↻ Ver de novo" (há algo animado para rever); padrão: depois da resposta */
  temReplay?: (spec: S, revelado: boolean) => boolean;
}

/**
 * Um renderizador por tipo de cena. O banco guarda só `{ tipo, ...parâmetros }`;
 * criar um tipo novo = schema em content/schema.ts + uma entrada aqui (o TypeScript cobra as duas).
 */
export const RENDERIZADORES: { [T in TipoCena]: RenderizadorCena<Extract<CenaSpec, { tipo: T }>> } = {
  'luzes-noite': {
    Desenho: ({ spec, revelado }) => <CenaLuzesNoite embarcacao={spec.embarcacao} aspecto={spec.aspecto} revelado={revelado} />,
    temAcao: () => false,
  },
  canal: {
    Desenho: ({ spec, revelado }) => <CenaCanal sentido={spec.sentido} oculto={spec.oculto && !revelado} />,
    temAcao: () => true,
  },
  marcas: {
    Desenho: ({ spec, revelado }) => <CenaMarcas oculto={spec.oculto && !revelado} />,
    temAcao: () => true,
  },
  encontro: {
    Desenho: ({ spec, revelado, apito }) => (
      <CenaEncontro sinal={spec.sinal} manobra={spec.manobra} vocePara={spec.vocePara} posicao={spec.posicao} revelado={revelado} apito={apito} />
    ),
    temAcao: (spec) => spec.manobra !== 'nenhuma',
  },
  bordos: {
    Desenho: () => <CenaBordos />,
    temAcao: () => false,
    temReplay: () => false,
  },
  no: {
    // o cabo some assim que a resposta é pedida; a passagem do cabo anima a partir da montagem
    Desenho: ({ spec, revelado, pedido }) => <CenaNo no={spec.no} oculto={spec.oculto && !pedido} revelado={revelado} />,
    temAcao: () => true,
    // o nó é passado ao montar: dá para rever sempre que ele está à mostra
    temReplay: (spec, revelado) => !(spec.oculto && !revelado),
  },
};

export function renderizador<S extends CenaSpec>(spec: S) {
  return RENDERIZADORES[spec.tipo] as unknown as RenderizadorCena<S>;
}
