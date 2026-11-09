'use client';

import { Defs, DiscoPergunta, INK, Ondas, Placa, Rotulo, useIdCena } from './comum';
import { BoiaFantasma, BoiaVerde, BoiaVermelha } from './CenaCanal';
import { COR, TRACO } from './tokens';
import s from './cenas.module.css';

/** Close das duas marcas laterais da Região B (formato e tope). `oculto`: fantasmas sem cor nem forma. */
export function CenaMarcas({ oculto = false }: { oculto?: boolean }) {
  const id = useIdCena();
  return (
    <svg className={s.svg} viewBox="0 0 400 260" role="img" aria-label="Close das marcas laterais: formato e tope">
      <Defs />
      <defs>
        <linearGradient id={id('mar')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={COR.marDia} />
          <stop offset="1" stopColor={COR.marDiaFundo} />
        </linearGradient>
      </defs>
      <rect width="400" height="260" fill={COR.ceuDia} />
      <rect y="150" width="400" height="110" fill={`url(#${id('mar')})`} />
      <line x1="0" y1="150" x2="400" y2="150" stroke={INK} strokeWidth={TRACO.principal} />
      <Ondas y={154} amp={3} comp={60} cor={COR.marDia} dur={8} />
      {oculto ? (
        <>
          <BoiaFantasma x={120} y={214} esc={1.9} />
          <BoiaFantasma x={280} y={214} esc={1.9} />
          <DiscoPergunta x={200} y={150} />
        </>
      ) : (
        <g className={s.surge}>
          <BoiaVerde x={120} y={214} esc={1.9} />
          <BoiaVermelha x={280} y={214} esc={1.9} />
        </g>
      )}
      <Ondas y={236} amp={5} comp={80} cor={COR.marDiaFundo} opacidade={0.9} dur={8} sentido={1} />
      <g className={s.revelar}>
        {/* linha de baixo = nome (com linha-guia até o tope); linha de cima = formato, sem linha: a guia nunca cruza texto */}
        <Rotulo x={24} y={54} anc="start" tamanho={10}>cilindro · tope ■</Rotulo>
        <Rotulo x={24} y={70} anc="start" alvo={[108, 86]} cor={COR.verde}>Bombordo</Rotulo>
        <Rotulo x={376} y={54} anc="end" tamanho={10}>cone · tope ▲</Rotulo>
        <Rotulo x={376} y={70} anc="end" alvo={[292, 88]} cor={COR.vermelho}>Boreste</Rotulo>
      </g>
      <Placa>Marcas laterais • Região B</Placa>
    </svg>
  );
}
