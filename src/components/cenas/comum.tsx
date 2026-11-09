import type { CSSProperties } from 'react';
import s from './cenas.module.css';

export const INK = '#0B1F3F';

export const COR_LUZ = {
  branca: '#FFFFFF',
  vermelha: '#FF3B30',
  verde: '#22E07A',
  amarela: '#FFD23F',
} as const;

export function Defs() {
  return (
    <defs>
      <filter id="blur" x="-1" y="-1" width="3" height="3">
        <feGaussianBlur stdDeviation="4" />
      </filter>
      <filter id="blurG" x="-1" y="-1" width="3" height="3">
        <feGaussianBlur stdDeviation="2" />
      </filter>
    </defs>
  );
}

/** Faixa de ondas animada (estilo cartoon). */
export function Ondas({
  y, amp, comp, cor, opacidade = 1, dur = 6, sentido = -1,
}: { y: number; amp: number; comp: number; cor: string; opacidade?: number; dur?: number; sentido?: 1 | -1 }) {
  let d = `M${-comp * 2},${y}`;
  for (let x = -comp * 2; x < 400 + comp * 2; x += comp) d += ` q${comp / 4},${-amp} ${comp / 2},0 t${comp / 2},0`;
  d += ` V300 H${-comp * 2} Z`;
  return (
    <path
      className={s.onda}
      style={{ '--d': `${dur}s`, '--w': `${sentido * comp}px` } as CSSProperties}
      d={d}
      fill={cor}
      opacity={opacidade}
    />
  );
}

export function Luz({ x, y, cor, r = 5 }: { x: number; y: number; cor: string; r?: number }) {
  return (
    <g>
      <circle className={s.halo} cx={x} cy={y} r={r * 3.6} fill={cor} opacity={0.35} filter="url(#blur)" />
      <circle cx={x} cy={y} r={r} fill={cor} />
      <circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.35} fill="#fff" opacity={0.9} />
    </g>
  );
}

/** Texto com contorno escuro — legível sobre qualquer fundo. */
export function Rotulo({
  x, y, children, cor = '#fff', anc = 'middle', tamanho = 11,
}: { x: number; y: number; children: string; cor?: string; anc?: 'start' | 'middle' | 'end'; tamanho?: number }) {
  const comum = { x, y, textAnchor: anc, fontWeight: 900, fontSize: tamanho, letterSpacing: 0.5, style: { fontFamily: 'var(--fonte)' } };
  return (
    <g>
      <text {...comum} fill="#fff" stroke={INK} strokeWidth={3.5} paintOrder="stroke">{children}</text>
      <text {...comum} fill={cor}>{children}</text>
    </g>
  );
}
