import { COR_LUZ, Defs, INK, Luz, Rotulo } from './comum';
import s from './cenas.module.css';

/** Vista de cima de uma lancha: bombordo (esquerda, vermelho) e boreste (direita, verde). */
export function CenaBordos() {
  return (
    <svg className={s.svg} viewBox="0 0 400 260" role="img" aria-label="Lancha vista de cima com bombordo e boreste indicados">
      <Defs />
      <rect width="400" height="260" fill="#2A7FD0" />
      <rect width="200" height="260" fill="#FF3B30" opacity=".12" />
      <rect x="200" width="200" height="260" fill="#22E07A" opacity=".12" />
      <line x1="200" y1="10" x2="200" y2="250" stroke="#fff" strokeWidth="2" strokeDasharray="5 6" opacity=".6" />
      <g transform="translate(200,138)">
        <g className={s.balanca}>
          <path d="M0,-92 C30,-60 40,-24 40,10 L40,72 Q40,86 24,88 L-24,88 Q-40,86 -40,72 L-40,10 C-40,-24 -30,-60 0,-92Z" fill="#fff" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
          <path d="M-26,-6 Q0,-24 26,-6 L26,14 L-26,14Z" fill="#9CCBF2" stroke={INK} strokeWidth="3" />
          <rect x="-22" y="30" width="44" height="34" rx="8" fill="#F5F1E6" stroke={INK} strokeWidth="3" />
          <Luz x={-40} y={-10} cor={COR_LUZ.vermelha} r={6} />
          <Luz x={40} y={-10} cor={COR_LUZ.verde} r={6} />
        </g>
      </g>
      <Rotulo x={200} y={30} tamanho={13}>▲ PROA</Rotulo>
      <Rotulo x={200} y={250} tamanho={13}>POPA</Rotulo>
      <Rotulo x={90} y={140} tamanho={16} cor="#FFD3CF">BOMBORDO</Rotulo>
      <Rotulo x={310} y={140} tamanho={16} cor="#C9FFDF">BORESTE</Rotulo>
      <Rotulo x={90} y={160} tamanho={11}>(esquerda · vermelho)</Rotulo>
      <Rotulo x={310} y={160} tamanho={11}>(direita · verde)</Rotulo>
    </svg>
  );
}
