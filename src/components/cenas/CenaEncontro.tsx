import { SINAIS, notacao, type SinalId } from '@/lib/ripeam/sinais';
import { Defs, INK, Luz, Rotulo, COR_LUZ } from './comum';
import s from './cenas.module.css';

type Manobra = 'boreste' | 'bombordo' | 'atras' | 'nenhuma';

/** Vista de cima. Visto de cima, guinar para BORESTE é girar no sentido horário. */
const NAVIO: Record<Manobra, string> = {
  boreste: 'rotate(220deg) translate(0,-85px)',
  bombordo: 'rotate(140deg) translate(0,-85px)',
  atras: 'rotate(180deg) translate(0,45px)',
  nenhuma: 'rotate(180deg)',
};

export function CenaEncontro({
  sinal, manobra, vocePara, revelado, apitos,
}: { sinal: SinalId; manobra: Manobra; vocePara?: 'boreste'; revelado: boolean; apitos: number }) {
  const def = SINAIS[sinal];
  const transfNavio = revelado ? NAVIO[manobra] : 'rotate(180deg)';
  const transfVoce = revelado && vocePara === 'boreste' ? 'rotate(40deg) translate(0,-70px)' : 'rotate(0deg)';

  const marcas = Array.from({ length: 14 }, (_, i) => (
    <path key={i} d={`M${(i * 97) % 400},${(i * 61) % 260} q6,-4 12,0 t12,0`} stroke="#fff" strokeWidth="2" fill="none" opacity=".35" strokeLinecap="round" />
  ));

  return (
    <svg className={s.svg} viewBox="0 0 400 260" role="img" aria-label="Vista de cima: um navio vindo de frente para a sua lancha">
      <Defs />
      <rect width="400" height="260" fill="#2A7FD0" />
      <g className={s.onda} style={{ ['--d' as string]: '8s', ['--w' as string]: '-97px' }}>
        {marcas}
        <g transform="translate(400,0)">{marcas}</g>
      </g>

      {revelado && manobra === 'boreste' && (
        <g>
          <path d="M200,110 Q198,140 150,180" stroke="#fff" strokeWidth="2.5" strokeDasharray="6 6" fill="none" opacity=".9" />
          {vocePara && <path d="M200,186 Q202,160 250,128" stroke="#fff" strokeWidth="2.5" strokeDasharray="6 6" fill="none" opacity=".9" />}
        </g>
      )}

      {/* navio — desenhado apontando para CIMA no sistema local: bombordo à esquerda (vermelha), boreste à direita (verde) */}
      <g transform="translate(200,62) scale(.8)">
        <g className={s.guina} style={{ transform: transfNavio }}>
          <path d="M0,-62 C15,-44 20,-22 20,0 L20,46 Q20,56 10,58 L-10,58 Q-20,56 -20,46 L-20,0 C-20,-22 -15,-44 0,-62Z" fill="#E9EEF5" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          <rect x="-16" y="4" width="32" height="10" rx="3" fill="var(--azul)" stroke={INK} strokeWidth="2.5" />
          <rect x="-12" y="14" width="24" height="26" rx="4" fill="#F5F1E6" stroke={INK} strokeWidth="2.5" />
          <circle cx="0" cy="30" r="6.5" fill="#C8372D" stroke={INK} strokeWidth="2.5" />
          <circle cx="0" cy="30" r="2.5" fill={INK} />
          <g key={apitos} className={apitos > 0 ? s.fumaca : s.fumacaParada}>
            <circle cx="0" cy="30" r="7" fill="#fff" stroke={INK} strokeWidth="2" />
            <circle cx="4" cy="26" r="6" fill="#fff" stroke={INK} strokeWidth="2" />
            <circle cx="8" cy="22" r="5" fill="#fff" stroke={INK} strokeWidth="2" />
          </g>
          <Luz x={0} y={-22} cor={COR_LUZ.branca} r={3} />
          <Luz x={-21} y={-8} cor={COR_LUZ.vermelha} r={3.4} />
          <Luz x={21} y={-8} cor={COR_LUZ.verde} r={3.4} />
        </g>
      </g>

      {/* sua lancha */}
      <g transform="translate(200,214)">
        <g className={s.guina} style={{ transform: transfVoce }}>
          <path className={s.esteira} d="M-6,26 L-14,62 M6,26 L14,62" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
          <path d="M0,-28 C9,-17 12,-6 12,4 L12,20 Q12,26 6,26 L-6,26 Q-12,26 -12,20 L-12,4 C-12,-6 -9,-17 0,-28Z" fill="#fff" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          <path d="M-8,-4 Q0,-10 8,-4 L8,4 L-8,4Z" fill="#9CCBF2" stroke={INK} strokeWidth="2" />
          <Luz x={-12} y={-2} cor={COR_LUZ.vermelha} r={2.6} />
          <Luz x={12} y={-2} cor={COR_LUZ.verde} r={2.6} />
        </g>
      </g>
      <Rotulo x={226} y={244} anc="start">VOCÊ</Rotulo>

      <g className={s.revelar}>
        <Rotulo x={16} y={24} anc="start">{`${notacao(def.sinal)}  =  "${def.significado}"`}</Rotulo>
      </g>
    </svg>
  );
}
