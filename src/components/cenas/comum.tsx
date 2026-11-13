'use client';

import { createContext, useContext, type CSSProperties, type ReactNode } from 'react';
import { COR, TRACO } from './tokens';
import s from './cenas.module.css';

export const INK = COR.tinta;

/** Cores de LUZ (não de objeto). */
export const COR_LUZ = {
  branca: COR.luzBranca,
  vermelha: COR.luzVermelha,
  verde: COR.luzVerde,
  amarela: COR.luzAmarela,
} as const;

/** Prefixo de ids da cena (useId na Moldura): evita colisão de filtros/gradientes/máscaras entre cenas. */
export const IdsCena = createContext('cena');
export function useIdCena() {
  const p = useContext(IdsCena);
  return (nome: string) => `${p}-${nome}`;
}

export function Defs() {
  const id = useIdCena();
  return (
    <defs>
      <filter id={id('blur')} x="-1" y="-1" width="3" height="3">
        <feGaussianBlur stdDeviation="4" />
      </filter>
      <filter id={id('blurG')} x="-1" y="-1" width="3" height="3">
        <feGaussianBlur stdDeviation="2" />
      </filter>
    </defs>
  );
}

/** Faixa de ondas (loop ambiente). */
export function Ondas({
  y, amp, comp, cor, opacidade = 1, dur = 8, sentido = -1,
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

/** Uma luz (de navegação ou de boia): halo + núcleo. `piscar` = lampejo (Fl) com período em s. */
export function Luz({ x, y, cor, r = 5, piscar, atraso = 0 }: { x: number; y: number; cor: string; r?: number; piscar?: number; atraso?: number }) {
  const id = useIdCena();
  const estilo = piscar ? ({ animationDuration: `${piscar}s`, animationDelay: `${atraso}s` } as CSSProperties) : undefined;
  return (
    <g className={piscar ? s.lampejo : undefined} style={estilo}>
      <circle className={piscar ? undefined : s.halo} cx={x} cy={y} r={r * 3.6} fill={cor} opacity={0.35} filter={`url(#${id('blur')})`} />
      <circle cx={x} cy={y} r={r} fill={cor} />
      <circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.35} fill="#fff" opacity={0.9} />
    </g>
  );
}

/** Espuma na linha d'água (no lugar de sombra, sobre a água). */
export function Espuma({ x, y, rx = 22 }: { x: number; y: number; rx?: number }) {
  return <ellipse cx={x} cy={y} rx={rx} ry={rx * 0.22} fill="#fff" opacity={0.5} />;
}

/**
 * Rótulo único: CAIXA ALTA, 12u, peso 900, branco com halo de tinta.
 * A cor entra por um ● antes do texto (nunca pintando a letra). `alvo` desenha a linha-guia até o objeto.
 */
export function Rotulo({
  x, y, children, cor, anc = 'middle', alvo, tamanho = 12,
}: {
  x: number; y: number; children: ReactNode; cor?: string;
  anc?: 'start' | 'middle' | 'end'; alvo?: [number, number]; tamanho?: number;
}) {
  const texto = typeof children === 'string' ? children.toUpperCase() : children;
  const comum = {
    x, y, textAnchor: anc, fontWeight: 900, fontSize: tamanho, letterSpacing: 0.4,
    style: { fontFamily: 'var(--fonte)' } as CSSProperties,
  };
  const fimX = x + (anc === 'end' ? 2 : anc === 'start' ? -2 : 0);
  const fimY = alvo && alvo[1] < y - tamanho ? y - tamanho - 1 : y + 3;
  return (
    <g>
      {alvo && (
        <g>
          <line x1={alvo[0]} y1={alvo[1]} x2={fimX} y2={fimY} stroke={INK} strokeWidth={TRACO.micro + 2} strokeLinecap="round" opacity={0.6} />
          <line x1={alvo[0]} y1={alvo[1]} x2={fimX} y2={fimY} stroke="#fff" strokeWidth={TRACO.micro} strokeLinecap="round" />
          <circle cx={alvo[0]} cy={alvo[1]} r={3} fill="#fff" stroke={INK} strokeWidth={1} />
        </g>
      )}
      <text {...comum} fill="#fff" stroke={INK} strokeWidth={3.5} paintOrder="stroke" strokeLinejoin="round">
        {cor && <tspan fill={cor}>● </tspan>}
        {texto}
      </text>
    </g>
  );
}

/** Plaquinha de contexto/notação: pílula de tinta a 85%, canto superior esquerdo. */
export function Placa({ children }: { children: string }) {
  // ~8,6 por caractere em 12u peso 900 caixa alta (bolinhas e espaços contam menos); acima de 376 quebra em 2 linhas
  const medir = (t: string) => [...t].reduce((w, c) => w + (c === ' ' ? 4 : c === '•' ? 6 : 8.6), 0) + 22;
  const texto = children.toUpperCase();
  let linhas = [texto];
  if (medir(texto) > 376) {
    const palavras = texto.split(' ');
    let i = palavras.length - 1;
    while (i > 1 && medir(palavras.slice(0, i).join(' ')) > 376) i--;
    linhas = [palavras.slice(0, i).join(' '), palavras.slice(i).join(' ')];
  }
  const largura = Math.min(376, Math.max(...linhas.map(medir)));
  return (
    <g>
      <rect x={12} y={10} width={largura} height={8 + 14 * linhas.length} rx={11} fill={INK} opacity={0.85} />
      <text x={23} y={25} fontWeight={900} fontSize={12} fill="#fff" letterSpacing={0.4} style={{ fontFamily: 'var(--fonte)' }}>
        {linhas.map((l, i) => (
          <tspan key={i} x={23} dy={i ? 14 : 0}>{l}</tspan>
        ))}
      </text>
    </g>
  );
}

/** Disco "?" do placeholder (fantasma). */
export function DiscoPergunta({ x = 200, y = 135 }: { x?: number; y?: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <circle r="22" fill={COR.azul} stroke={INK} strokeWidth={TRACO.principal} />
      <text y="10" textAnchor="middle" fontSize="28" fontWeight="900" fill="#fff" style={{ fontFamily: 'var(--fonte)' }}>?</text>
    </g>
  );
}
