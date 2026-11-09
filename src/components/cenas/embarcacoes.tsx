'use client';

import { COR_LUZ, INK, Luz } from './comum';
import { COR, TRACO } from './tokens';

/** Lancha "VOCÊ" vista de cima, apontando para CIMA (bombordo à esquerda, boreste à direita). ~56 de comprimento. */
export function LanchaPlano({ luzes = true }: { luzes?: boolean }) {
  return (
    <g>
      <path
        d="M0,-28 C9,-17 12,-6 12,4 L12,20 Q12,26 6,26 L-6,26 Q-12,26 -12,20 L-12,4 C-12,-6 -9,-17 0,-28Z"
        fill={COR.casco} stroke={INK} strokeWidth={TRACO.principal} strokeLinejoin="round"
      />
      <path d="M-8,-4 Q0,-10 8,-4 L8,4 L-8,4Z" fill={COR.vidro} stroke={INK} strokeWidth={TRACO.detalhe} strokeLinejoin="round" />
      <path d="M-9,12 L9,12" stroke={COR.azul} strokeWidth={4} strokeLinecap="round" />
      {luzes && <Luz x={-12} y={-2} cor={COR_LUZ.vermelha} r={2.6} />}
      {luzes && <Luz x={12} y={-2} cor={COR_LUZ.verde} r={2.6} />}
    </g>
  );
}

/** Navio visto de cima, apontando para CIMA. ~124 de comprimento. Chaminé em (0,30). */
export function NavioPlano() {
  return (
    <g>
      <path
        d="M0,-62 C15,-44 20,-22 20,0 L20,46 Q20,56 10,58 L-10,58 Q-20,56 -20,46 L-20,0 C-20,-22 -15,-44 0,-62Z"
        fill={COR.casco} stroke={INK} strokeWidth={TRACO.principal} strokeLinejoin="round"
      />
      <path d="M-14,-30 L14,-30" stroke={INK} strokeWidth={TRACO.micro} opacity={0.35} />
      <rect x="-16" y="4" width="32" height="10" rx="3" fill={COR.azul} stroke={INK} strokeWidth={TRACO.detalhe} />
      <rect x="-12" y="14" width="24" height="26" rx="4" fill={COR.papel} stroke={INK} strokeWidth={TRACO.detalhe} />
      <circle cx="0" cy="30" r="6.5" fill={COR.vermelho} stroke={INK} strokeWidth={TRACO.detalhe} />
      <circle cx="0" cy="30" r="2.5" fill={INK} />
      <Luz x={0} y={-22} cor={COR_LUZ.branca} r={3} />
      <Luz x={-21} y={-8} cor={COR_LUZ.vermelha} r={3.4} />
      <Luz x={21} y={-8} cor={COR_LUZ.verde} r={3.4} />
    </g>
  );
}
