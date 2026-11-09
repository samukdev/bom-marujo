import type { Sentido } from '@/lib/iala/boias';
import { bordoParaDeixar } from '@/lib/iala/boias';
import { Defs, INK, Ondas, Rotulo } from './comum';
import s from './cenas.module.css';

const VERM = '#D4342B';
const VERDE = '#1F8A4C';

/** IALA B — marca de BORESTE (de quem entra): vermelha, cônica, tope cone ▲, luz vermelha. */
function BoiaVermelha({ x, y, esc, atraso }: { x: number; y: number; esc: number; atraso: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${esc})`}>
      <g className={s.boia} style={{ animationDelay: `${atraso}s` }}>
        <ellipse cx="0" cy="2" rx="22" ry="5" fill="#fff" opacity=".55" />
        <path d="M-17,0 L17,0 L6,-38 L-6,-38Z" fill={VERM} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <path d="M-12,-6 L-4,-34" stroke="#fff" strokeWidth="3" opacity=".35" strokeLinecap="round" />
        <rect x="-2.5" y="-60" width="5" height="22" fill={INK} />
        <rect x="-5" y="-52" width="10" height="8" rx="2" fill="#FFD9D6" stroke={INK} strokeWidth="2" />
        <circle className={s.lampejo} style={{ animationDelay: `${atraso}s` }} cx="0" cy="-48" r="14" fill="#FF3B30" opacity=".8" filter="url(#blur)" />
        <path d="M-9,-60 L9,-60 L0,-76Z" fill={VERM} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      </g>
    </g>
  );
}

/** IALA B — marca de BOMBORDO (de quem entra): verde, cilíndrica, tope cilindro ■, luz verde. */
function BoiaVerde({ x, y, esc, atraso }: { x: number; y: number; esc: number; atraso: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${esc})`}>
      <g className={s.boia} style={{ animationDelay: `${atraso}s` }}>
        <ellipse cx="0" cy="2" rx="22" ry="5" fill="#fff" opacity=".55" />
        <rect x="-14" y="-36" width="28" height="36" rx="2" fill={VERDE} stroke={INK} strokeWidth="3" />
        <path d="M-9,-31 L-9,-5" stroke="#fff" strokeWidth="3" opacity=".35" strokeLinecap="round" />
        <rect x="-2.5" y="-58" width="5" height="22" fill={INK} />
        <rect x="-5" y="-52" width="10" height="8" rx="2" fill="#D6FFE6" stroke={INK} strokeWidth="2" />
        <circle className={s.lampejo} style={{ animationDelay: `${atraso}s` }} cx="0" cy="-48" r="14" fill="#22E07A" opacity=".8" filter="url(#blur)" />
        <rect x="-7.5" y="-72" width="15" height="14" rx="1.5" fill={VERDE} stroke={INK} strokeWidth="2.5" />
      </g>
    </g>
  );
}

const PARES = [
  { y: 112, esc: 0.3, dx: 28 },
  { y: 134, esc: 0.55, dx: 60 },
  { y: 178, esc: 1, dx: 130 },
];

export function CenaCanal({ sentido }: { sentido: Sentido }) {
  // Do ponto de vista de quem navega: em que lado da TELA fica a vermelha?
  const vermelhaADireita = bordoParaDeixar('vermelha', sentido) === 'boreste';
  const lado = (dir: boolean) => (dir ? 1 : -1);
  const entrando = sentido === 'entrando';

  return (
    <svg className={s.svg} viewBox="0 0 400 260" role="img" aria-label={entrando ? 'Entrando no porto por um canal balizado' : 'Saindo do porto por um canal balizado'}>
      <Defs />
      <linearGradient id="ceuD" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#7EC3F5" />
        <stop offset="1" stopColor="#D8EEFC" />
      </linearGradient>
      <linearGradient id="marD" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2F86D6" />
        <stop offset="1" stopColor="#1557A8" />
      </linearGradient>
      <rect width="400" height="260" fill="url(#ceuD)" />
      <circle cx="60" cy="34" r="16" fill="#FFE07A" stroke={INK} strokeWidth="2.5" />
      <g className={s.nuvem}>
        <path d="M0,40 q6,-14 20,-8 q8,-12 22,-2 q14,-2 12,10 z" fill="#fff" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      </g>
      <g className={s.nuvem} style={{ animationDelay: '-22s' }}>
        <path d="M0,62 q5,-10 16,-6 q7,-9 17,-1 q11,-1 9,7 z" fill="#fff" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      </g>
      {entrando ? (
        <>
          <path d="M110,104 v-10 h14 v-8 h12 v18 M240,104 v-14 h10 v-6 h14 v20 h18 v-10 h12 v10" fill="#B9C9DD" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
          <g transform="translate(296,104)">
            <path d="M-5,0 L-3,-30 L3,-30 L5,0Z" fill="#fff" stroke={INK} strokeWidth="2" />
            <rect x="-3.5" y="-22" width="7" height="5" fill={VERM} />
            <rect x="-4" y="-36" width="8" height="6" fill="#FFE07A" stroke={INK} strokeWidth="2" />
          </g>
        </>
      ) : (
        <Rotulo x={330} y={96} cor="#fff" tamanho={10}>MAR ABERTO</Rotulo>
      )}
      <rect y="103" width="400" height="157" fill="url(#marD)" />
      <line x1="0" y1="104" x2="400" y2="104" stroke={INK} strokeWidth="2.5" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i} className={s.avanco} style={{ animationDelay: `${i * 0.9}s` }} stroke="#fff" strokeWidth="1.5" strokeLinecap="round" opacity=".7">
          <line x1="150" y1="122" x2="166" y2="122" />
          <line x1="236" y1="128" x2="254" y2="128" />
          <line x1="120" y1="140" x2="132" y2="140" />
          <line x1="268" y1="146" x2="282" y2="146" />
        </g>
      ))}
      {PARES.map((p, i) => (
        <g key={i}>
          <BoiaVermelha x={200 + lado(vermelhaADireita) * p.dx} y={p.y} esc={p.esc} atraso={i * 0.7} />
          <BoiaVerde x={200 - lado(vermelhaADireita) * p.dx} y={p.y} esc={p.esc} atraso={i * 0.7 + 1.1} />
        </g>
      ))}
      <g className={s.revelar}>
        <path d="M200,232 C200,190 200,150 200,112" stroke="#fff" strokeWidth="3" strokeDasharray="7 7" fill="none" />
        <path d="M193,120 L200,108 L207,120" stroke="#fff" strokeWidth="3" fill="none" strokeLinejoin="round" />
        <Rotulo x={330} y={208} cor={vermelhaADireita ? '#FFD3CF' : '#C9FFDF'}>{vermelhaADireita ? 'BORESTE ▸ vermelha' : 'BORESTE ▸ verde'}</Rotulo>
        <Rotulo x={70} y={208} cor={vermelhaADireita ? '#C9FFDF' : '#FFD3CF'}>{vermelhaADireita ? '◂ BOMBORDO verde' : '◂ BOMBORDO vermelha'}</Rotulo>
      </g>
      {/* nossa lancha, vista pela popa */}
      <g transform="translate(200,234)">
        <g className={s.balanca}>
          <path className={s.esteira} d="M-14,14 L-60,40 M14,14 L60,40 M0,16 L0,40" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
          <rect x="-18" y="-30" width="36" height="20" rx="5" fill="#fff" stroke={INK} strokeWidth="3" />
          <rect x="-13" y="-26" width="26" height="9" rx="3" fill="#9CCBF2" stroke={INK} strokeWidth="2" />
          <path d="M-36,-12 L36,-12 L28,12 L-28,12Z" fill="#fff" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          <path d="M-33,-3 L33,-3" stroke="var(--azul)" strokeWidth="5" />
          <rect x="-6" y="4" width="12" height="16" rx="3" fill="#2B2F38" stroke={INK} strokeWidth="2" />
        </g>
      </g>
      <Ondas y={252} amp={3} comp={50} cor="#124C96" opacidade={0.9} dur={4} />
    </svg>
  );
}
