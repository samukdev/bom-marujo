'use client';

import type { CSSProperties } from 'react';
import { Defs, Placa, Rotulo } from './comum';
import { LanchaPlano } from './embarcacoes';
import { COR, TRACO } from './tokens';
import s from './cenas.module.css';

/** Plano (vista de cima): a mesma lancha VOCÊ, com bombordo (esquerda, vermelho) e boreste (direita, verde). */
export function CenaBordos() {
  const marcas = Array.from({ length: 12 }, (_, i) => (
    <path key={i} d={`M${(i * 97) % 400},${40 + ((i * 61) % 210)} q6,-4 12,0 t12,0`} stroke="#fff" strokeWidth={TRACO.micro} fill="none" opacity=".35" strokeLinecap="round" />
  ));
  return (
    <svg className={s.svg} viewBox="0 0 400 260" role="img" aria-label="Lancha vista de cima: bombordo à esquerda (vermelho), boreste à direita (verde)">
      <Defs />
      <rect width="400" height="260" fill={COR.marDia} />
      <g className={s.onda} style={{ '--d': '8s', '--w': '-97px' } as CSSProperties}>
        {marcas}
        <g transform="translate(400,0)">{marcas}</g>
      </g>
      <line x1="200" y1="44" x2="200" y2="244" stroke="#fff" strokeWidth={TRACO.micro} strokeDasharray="5 6" opacity=".6" />
      <g transform="translate(200,146) scale(2.9)">
        <LanchaPlano />
      </g>
      <Rotulo x={200} y={52} tamanho={12}>▲ Proa</Rotulo>
      <Rotulo x={200} y={250} tamanho={12}>Popa</Rotulo>
      <Rotulo x={150} y={112} anc="end" tamanho={10}>esquerda · vermelho</Rotulo>
      <Rotulo x={150} y={128} anc="end" alvo={[166, 142]} cor={COR.vermelho}>Bombordo</Rotulo>
      <Rotulo x={250} y={112} anc="start" tamanho={10}>direita · verde</Rotulo>
      <Rotulo x={250} y={128} anc="start" alvo={[234, 142]} cor={COR.verde}>Boreste</Rotulo>
      <Placa>Vista de cima</Placa>
    </svg>
  );
}
