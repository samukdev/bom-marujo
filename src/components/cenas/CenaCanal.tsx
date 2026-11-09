'use client';

import type { Sentido } from '@/lib/iala/boias';
import { bordoParaDeixar } from '@/lib/iala/boias';
import { COR_LUZ, Defs, DiscoPergunta, Espuma, INK, Luz, Ondas, Placa, Rotulo, useIdCena } from './comum';
import { COR, TRACO } from './tokens';
import s from './cenas.module.css';

const HORIZONTE = 104;

/** IALA B — marca de BORESTE (de quem entra): vermelha, cônica, tope cone ▲, luz vermelha. */
export function BoiaVermelha({ x, y, esc, atraso = 0 }: { x: number; y: number; esc: number; atraso?: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${esc})`}>
      <g className={s.boia} style={{ animationDelay: `${atraso}s` }}>
        <Espuma x={0} y={2} />
        <path d="M-17,0 L17,0 L6,-38 L-6,-38Z" fill={COR.vermelho} stroke={INK} strokeWidth={TRACO.principal} strokeLinejoin="round" />
        <path d="M-12,-6 L-4,-34" stroke="#fff" strokeWidth={TRACO.principal} opacity=".35" strokeLinecap="round" />
        <rect x="-2.5" y="-60" width="5" height="22" fill={INK} />
        <rect x="-5" y="-52" width="10" height="8" rx="2" fill="#fff" stroke={INK} strokeWidth={TRACO.detalhe} />
        <Luz x={0} y={-48} cor={COR_LUZ.vermelha} r={3} piscar={3} atraso={atraso} />
        <path d="M-9,-60 L9,-60 L0,-76Z" fill={COR.vermelho} stroke={INK} strokeWidth={TRACO.detalhe} strokeLinejoin="round" />
      </g>
    </g>
  );
}

/** IALA B — marca de BOMBORDO (de quem entra): verde, cilíndrica, tope cilindro ■, luz verde. */
export function BoiaVerde({ x, y, esc, atraso = 0 }: { x: number; y: number; esc: number; atraso?: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${esc})`}>
      <g className={s.boia} style={{ animationDelay: `${atraso}s` }}>
        <Espuma x={0} y={2} />
        <rect x="-14" y="-36" width="28" height="36" rx="2" fill={COR.verde} stroke={INK} strokeWidth={TRACO.principal} />
        <path d="M-9,-31 L-9,-5" stroke="#fff" strokeWidth={TRACO.principal} opacity=".35" strokeLinecap="round" />
        <rect x="-2.5" y="-58" width="5" height="22" fill={INK} />
        <rect x="-5" y="-52" width="10" height="8" rx="2" fill="#fff" stroke={INK} strokeWidth={TRACO.detalhe} />
        <Luz x={0} y={-48} cor={COR_LUZ.verde} r={3} piscar={3} atraso={atraso} />
        <rect x="-7.5" y="-72" width="15" height="14" rx="1.5" fill={COR.verde} stroke={INK} strokeWidth={TRACO.detalhe} />
      </g>
    </g>
  );
}

/** Fantasma de boia: silhueta neutra, sem cor nem forma (não entrega a resposta). */
export function BoiaFantasma({ x, y, esc }: { x: number; y: number; esc: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${esc})`}>
      <Espuma x={0} y={2} />
      <rect x="-12" y="-62" width="24" height="62" rx="12" fill={COR.fantasma} stroke={COR.fantasma} strokeWidth={TRACO.principal} />
    </g>
  );
}

// perspectiva coerente: dx/(y − horizonte) constante (ponto de fuga no horizonte, x = 200)
const PARES = [
  { y: 120, esc: 0.22, dx: 28 },
  { y: 138, esc: 0.46, dx: 60 },
  { y: 178, esc: 1, dx: 130 },
];

/** Canal balizado, "olho do timoneiro" a partir da popa da lancha VOCÊ. */
export function CenaCanal({ sentido, oculto = false }: { sentido: Sentido; oculto?: boolean }) {
  const id = useIdCena();
  const vermelhaADireita = bordoParaDeixar('vermelha', sentido) === 'boreste';
  const lado = (dir: boolean) => (dir ? 1 : -1);
  const entrando = sentido === 'entrando';

  return (
    <svg className={s.svg} viewBox="0 0 400 260" role="img" aria-label={entrando ? 'Entrando no porto por um canal balizado' : 'Saindo do porto por um canal balizado'}>
      <Defs />
      <defs>
        <linearGradient id={id('mar')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={COR.marDia} />
          <stop offset="1" stopColor={COR.marDiaFundo} />
        </linearGradient>
      </defs>
      <rect width="400" height="260" fill={COR.ceuDia} />
      <circle cx="350" cy="56" r="14" fill="#FFE07A" stroke={INK} strokeWidth={TRACO.detalhe} />
      {entrando && (
        <g>
          <path d="M110,104 v-10 h14 v-8 h12 v18 M240,104 v-14 h10 v-6 h14 v20 h18 v-10 h12 v10" fill={COR.metal} stroke={INK} strokeWidth={TRACO.detalhe} strokeLinejoin="round" />
          <g transform="translate(296,104)">
            <path d="M-5,0 L-3,-30 L3,-30 L5,0Z" fill="#fff" stroke={INK} strokeWidth={TRACO.detalhe} />
            <rect x="-3.5" y="-22" width="7" height="5" fill={COR.vermelho} />
            <rect x="-4" y="-36" width="8" height="6" fill="#FFE07A" stroke={INK} strokeWidth={TRACO.detalhe} />
          </g>
        </g>
      )}
      <rect y={HORIZONTE - 1} width="400" height={260 - HORIZONTE + 1} fill={`url(#${id('mar')})`} />
      <line x1="0" y1={HORIZONTE} x2="400" y2={HORIZONTE} stroke={INK} strokeWidth={TRACO.principal} />

      {PARES.map((p, i) => (
        <g key={i}>
          {oculto ? (
            <>
              <BoiaFantasma x={200 + p.dx} y={p.y} esc={p.esc} />
              <BoiaFantasma x={200 - p.dx} y={p.y} esc={p.esc} />
            </>
          ) : (
            <g className={s.surge}>
              <BoiaVermelha x={200 + lado(vermelhaADireita) * p.dx} y={p.y} esc={p.esc} atraso={i * 0.7} />
              <BoiaVerde x={200 - lado(vermelhaADireita) * p.dx} y={p.y} esc={p.esc} atraso={i * 0.7 + 1.1} />
            </g>
          )}
        </g>
      ))}
      {oculto && <DiscoPergunta x={200} y={150} />}

      <g className={s.revelar}>
        <path d="M200,226 C200,190 200,150 200,118" stroke="#fff" strokeWidth={TRACO.principal} strokeDasharray="7 7" fill="none" />
        <path d="M193,126 L200,114 L207,126" stroke="#fff" strokeWidth={TRACO.principal} fill="none" strokeLinejoin="round" />
        <Rotulo x={330} y={214} alvo={[330, 166]} cor={vermelhaADireita ? COR.vermelho : COR.verde}>Boreste</Rotulo>
        <Rotulo x={70} y={214} alvo={[70, 166]} cor={vermelhaADireita ? COR.verde : COR.vermelho}>Bombordo</Rotulo>
      </g>

      {/* nossa lancha, vista pela popa */}
      <g transform="translate(200,234)">
        <g className={s.balanca}>
          <path className={s.esteira} d="M-14,14 L-60,40 M14,14 L60,40 M0,16 L0,40" stroke="#fff" strokeWidth={TRACO.principal} strokeLinecap="round" />
          <rect x="-18" y="-30" width="36" height="20" rx="5" fill={COR.casco} stroke={INK} strokeWidth={TRACO.principal} />
          <rect x="-13" y="-26" width="26" height="9" rx="3" fill={COR.vidro} stroke={INK} strokeWidth={TRACO.detalhe} />
          <path d="M-36,-12 L36,-12 L28,12 L-28,12Z" fill={COR.casco} stroke={INK} strokeWidth={TRACO.principal} strokeLinejoin="round" />
          <path d="M-33,-3 L33,-3" stroke={COR.azul} strokeWidth={5} />
          <rect x="-6" y="4" width="12" height="16" rx="3" fill="#2B2F38" stroke={INK} strokeWidth={TRACO.detalhe} />
        </g>
      </g>
      <Rotulo x={244} y={250} anc="start">Você</Rotulo>
      <Ondas y={252} amp={3} comp={50} cor={COR.marDiaFundo} opacidade={0.9} dur={8} />
      <Placa>{entrando ? 'Entrando no porto' : 'Saindo para o mar'}</Placa>
    </svg>
  );
}
