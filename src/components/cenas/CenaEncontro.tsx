'use client';

import type { CSSProperties } from 'react';
import { SINAIS, notacao, type SinalId } from '@/lib/ripeam/sinais';
import { Defs, INK, Placa, Rotulo } from './comum';
import { LanchaPlano, NavioPlano } from './embarcacoes';
import type { EstadoApito } from './Cena';
import { COR, TRACO } from './tokens';
import s from './cenas.module.css';

type Manobra = 'boreste' | 'bombordo' | 'atras' | 'nenhuma';

const ESCALA_NAVIO = 0.9;
/** Navio: posição inicial e transformação depois da manobra (vista de cima: guinar para BORESTE = sentido horário). */
const NAVIO = {
  proa: { x: 200, y: 100, giro: 180 },
  boreste: { x: 300, y: 92, giro: 180 },
} as const;
const MANOBRA: Record<Manobra, { giro: number; avanco: number }> = {
  boreste: { giro: 55, avanco: 70 },
  bombordo: { giro: -40, avanco: 80 },
  atras: { giro: 0, avanco: -14 },
  nenhuma: { giro: 0, avanco: 0 },
};
const VOCE = { x: 200, y: 222 };

const rad = (g: number) => (g * Math.PI) / 180;
/** Ponto local do navio → coordenada de tela, dado giro total e avanço (para a fumaça seguir a chaminé). */
function tela(base: { x: number; y: number }, giro: number, avanco: number, lx: number, ly: number) {
  const px = lx, py = ly - avanco; // avanço = para a proa (y local negativo)
  const c = Math.cos(rad(giro)), sn = Math.sin(rad(giro));
  return { x: base.x + ESCALA_NAVIO * (px * c - py * sn), y: base.y + ESCALA_NAVIO * (px * sn + py * c) };
}

export function CenaEncontro({
  sinal, manobra, vocePara, posicao = 'proa', revelado, apito,
}: { sinal: SinalId; manobra: Manobra; vocePara?: 'boreste'; posicao?: 'proa' | 'boreste'; revelado: boolean; apito?: EstadoApito }) {
  const def = SINAIS[sinal];
  const base = NAVIO[posicao];
  const m = revelado ? MANOBRA[manobra] : MANOBRA.nenhuma;
  const giro = base.giro + m.giro;
  const transfNavio = `rotate(${giro}deg) translate(0px, ${-m.avanco}px)`;
  const voceMove = revelado && vocePara === 'boreste';
  const transfVoce = voceMove ? 'rotate(55deg) translate(0px, -60px)' : 'rotate(0deg)';
  const chamine = tela(base, giro, m.avanco, 0, 30);

  // trajetória tracejada (aparece na revelação)
  const fim = tela(base, base.giro + MANOBRA[manobra].giro, MANOBRA[manobra].avanco, 0, 0);
  const trajNavio = manobra !== 'nenhuma' ? `M${base.x},${base.y} Q${base.x + (fim.x - base.x) * 0.15},${(base.y + fim.y) / 2 + 10} ${fim.x},${fim.y}` : null;

  const marcas = Array.from({ length: 14 }, (_, i) => (
    <path key={i} d={`M${(i * 97) % 400},${40 + ((i * 61) % 210)} q6,-4 12,0 t12,0`} stroke="#fff" strokeWidth={TRACO.micro} fill="none" opacity=".35" strokeLinecap="round" />
  ));

  return (
    <svg className={s.svg} viewBox="0 0 400 260" role="img" aria-label={`Vista de cima: navio e a sua lancha. ${revelado ? def.significado : ''}`}>
      <Defs />
      <rect width="400" height="260" fill={COR.marDia} />
      <g className={s.onda} style={{ '--d': '8s', '--w': '-97px' } as CSSProperties}>
        {marcas}
        <g transform="translate(400,0)">{marcas}</g>
      </g>

      <g className={s.revelar}>
        {trajNavio && <path d={trajNavio} stroke="#fff" strokeWidth={TRACO.principal} strokeDasharray="7 7" fill="none" opacity=".9" />}
        {voceMove && <path d={`M${VOCE.x},${VOCE.y - 26} Q${VOCE.x + 8},${VOCE.y - 50} ${VOCE.x + 49},${VOCE.y - 34 - 22}`} stroke="#fff" strokeWidth={TRACO.principal} strokeDasharray="7 7" fill="none" opacity=".9" />}
      </g>

      <g transform={`translate(${base.x},${base.y}) scale(${ESCALA_NAVIO})`}>
        <g className={s.guina} style={{ transform: transfNavio }}>
          {/* máquinas atrás: água revolvida na popa (hélice dando ré) + seta curta para ré */}
          {revelado && manobra === 'atras' && (
            <g className={s.revelar}>
              <ellipse cx="0" cy="66" rx="22" ry="10" fill="#fff" opacity=".75" />
              <ellipse cx="-12" cy="72" rx="9" ry="5" fill="#fff" opacity=".6" />
              <ellipse cx="12" cy="74" rx="8" ry="4" fill="#fff" opacity=".6" />
              {/* seta ao lado do casco, apontando para a POPA (sentido do movimento a ré) */}
              <path d="M34,-14 L34,26 M27,18 L34,26 L41,18" stroke="#fff" strokeWidth={TRACO.principal} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity=".9" />
            </g>
          )}
          <NavioPlano />
        </g>
      </g>
      {/* fumaça do apito: em coordenada de TELA (sobe para cima), com a duração do apito */}
      {apito && apito.n > 0 && (
        <g key={apito.n} className={s.fumaca} style={{ '--dur': `${apito.dur}s` } as CSSProperties} transform={`translate(${chamine.x},${chamine.y})`}>
          <circle r="6" fill="#fff" stroke={INK} strokeWidth={TRACO.detalhe} />
          <circle cx="4" cy="-5" r="5" fill="#fff" stroke={INK} strokeWidth={TRACO.detalhe} />
          <circle cx="8" cy="-10" r="4" fill="#fff" stroke={INK} strokeWidth={TRACO.detalhe} />
        </g>
      )}

      <g transform={`translate(${VOCE.x},${VOCE.y})`}>
        <g className={s.guina} style={{ transform: transfVoce }}>
          <LanchaPlano />
        </g>
      </g>
      <g style={{ opacity: voceMove ? 0 : 1, transition: 'opacity .3s' }}>
        <Rotulo x={VOCE.x + 22} y={VOCE.y + 22} anc="start">VOCÊ</Rotulo>
      </g>
      {/* depois da guinada, o VOCÊ reaparece junto da lancha (posição final: rotate 55° + 60 à frente) */}
      {voceMove && (
        <g className={s.revelar}>
          <Rotulo x={VOCE.x + 49 + 24} y={VOCE.y - 34 + 26} anc="start">VOCÊ</Rotulo>
        </g>
      )}

      {revelado ? <Placa>{`${notacao(def.sinal)}  =  ${def.rotulo}`}</Placa> : <Placa>Vista de cima</Placa>}
    </svg>
  );
}
