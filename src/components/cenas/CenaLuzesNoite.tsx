'use client';

import { luzesExibidas, luzesVisiveis, projetarX, type EmbarcacaoSpec, type LuzDef } from '@/lib/ripeam/luzes';
import { COR_LUZ, Defs, Luz, Ondas, Placa, Rotulo, useIdCena } from './comum';
import { COR, TRACO } from './tokens';
import s from './cenas.module.css';

const L = 190; // comprimento na tela
const B = 96; // boca na tela (exagerada para leitura)
const CX = 220;
const WL = 182; // linha d'água

const NOMES: Record<string, string> = {
  'mastro-av': 'Mastro',
  'mastro-ar': 'Mastro de ré',
  'bordo-be': 'Boreste',
  'bordo-bb': 'Bombordo',
  alcancado: 'Alcançado',
  fundeio: 'Fundeio',
  'fundeio-av': 'Fundeio',
  'fundeio-ar': 'Fundeio',
  'sg-sup': 'Sem governo',
  'arr-sup': 'Arrasto',
};

const px = (f: number, sl: number, a: number) => CX + projetarX(f * L, sl * B, a);
const altura = (h: number) => WL - 24 - h * 104;

/**
 * Luzes à noite, "olho do timoneiro". ANTES da resposta: só as luzes (à noite não se vê o casco).
 * DEPOIS: a silhueta aparece e entram os rótulos.
 */
export function CenaLuzesNoite({ embarcacao, aspecto, revelado }: { embarcacao: EmbarcacaoSpec; aspecto: number; revelado: boolean }) {
  const id = useIdCena();
  const rad = (aspecto * Math.PI) / 180;
  const sin = Math.sin(rad);
  const luzes = luzesVisiveis(embarcacao, aspecto);

  const xs = [px(0.5, 0, aspecto), px(-0.5, 0.5, aspecto), px(-0.5, -0.5, aspecto), px(0.2, 0.5, aspecto), px(0.2, -0.5, aspecto)];
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const deFrente = Math.abs(sin) < 0.35;
  const proaADireita = sin > 0;
  const topo = WL - 22, fundo = WL + 8;
  const casco = deFrente
    ? `M${minX},${topo} L${maxX},${topo} L${CX + (maxX - CX) * 0.4},${fundo} L${CX + (minX - CX) * 0.4},${fundo}Z`
    : proaADireita
      ? `M${minX},${topo} L${maxX + 8},${topo - 6} L${maxX - 28},${fundo} L${minX + 4},${fundo}Z`
      : `M${minX - 8},${topo - 6} L${maxX},${topo} L${maxX - 4},${fundo} L${minX + 28},${fundo}Z`;
  const larguraCabine = 0.32 * L * Math.abs(sin) + 0.6 * B * Math.abs(Math.cos(rad));
  const xCabine = px(0.02, 0, aspecto);
  const mastros = Array.from(new Set(luzesExibidas(embarcacao).filter((l) => l.h >= 0.6).map((l) => l.f)));
  const vela = embarcacao.tipo === 'vela';
  const posLuz = (l: LuzDef) => ({ x: px(l.f, l.s, aspecto), y: altura(l.h) });
  const traco = { stroke: COR.tintaNoite, strokeWidth: TRACO.principal, strokeLinejoin: 'round' as const };

  // rótulos: lado escolhido pela posição da luz; todos dentro da margem segura (16) e abaixo da plaquinha (y > 44)
  const rotulos = luzes.filter((l) => NOMES[l.id]).map((l, i) => {
    const p = posLuz(l);
    const lado = p.x < CX - 4 ? -1 : p.x > CX + 4 ? 1 : i % 2 ? -1 : 1;
    // largura aproximada do texto (12u, caixa alta) + bolinha de cor: o rótulo inteiro fica na margem segura
    const largura = NOMES[l.id]!.length * 9 + (l.cor === 'branca' ? 0 : 14);
    const tx = lado > 0 ? Math.min(p.x + 46, 384 - largura) : Math.max(p.x - 46, 16 + largura);
    const ty = Math.max(50, p.y - 26);
    return { l, p, lado, tx, ty };
  });

  return (
    <svg className={s.svg} viewBox="0 0 400 260" role="img" aria-label={`Cena noturna com luzes de uma embarcação${revelado ? ': ' + luzes.map((l) => NOMES[l.id] ?? l.cor).join(', ') : ''}`}>
      <Defs />
      <defs>
        <linearGradient id={id('ceu')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#050D1F" />
          <stop offset="1" stopColor={COR.ceuNoite} />
        </linearGradient>
        <mask id={id('lua')}>
          <circle cx="56" cy="62" r="14" fill="#fff" />
          <circle cx="63" cy="57" r="13" fill="#000" />
        </mask>
      </defs>
      <rect width="400" height="260" fill={`url(#${id('ceu')})`} />
      {Array.from({ length: 24 }, (_, i) => ({ i, cx: (i * 137 + 90) % 400, cy: ((i * 53) % 100) + 44 }))
        // estrelas longe dos rótulos (não podem parecer pontuação)
        .filter(({ cx, cy }) => !rotulos.some(({ l, tx, ty, lado }) => {
          const w = NOMES[l.id]!.length * 9 + 14;
          const x0 = lado < 0 ? tx - w : tx;
          return cx > x0 - 8 && cx < x0 + w + 8 && cy > ty - 18 && cy < ty + 8;
        }))
        .map(({ i, cx, cy }) => (
          <circle key={i} cx={cx} cy={cy} r={(i % 3) * 0.5 + 0.6} fill="#fff" opacity={0.7} />
        ))}
      <circle cx="56" cy="62" r="14" fill={COR.papel} mask={`url(#${id('lua')})`} />
      <rect y="150" width="400" height="110" fill={COR.marNoite} />
      <Ondas y={152} amp={3} comp={60} cor="#0F2B57" dur={8} />

      <g className={s.balanca} style={{ transformOrigin: `${CX}px ${WL}px` }}>
        {luzes.map((l) => {
          const p = posLuz(l);
          return <rect key={`r-${l.id}`} x={p.x - 4} y={WL + 10} width={8} height={30 + l.h * 30} rx={4} fill={COR_LUZ[l.cor]} opacity={0.4} filter={`url(#${id('blurG')})`} />;
        })}
        {/* silhueta: só depois da resposta */}
        <g className={s.revelar}>
          {mastros.map((f) => (
            <rect key={`m-${f}`} x={px(f, 0, aspecto) - 2} y={altura(1) - 4} width={4} height={topo - altura(1) + 4} fill={COR.cascoNoite} {...traco} strokeWidth={TRACO.micro} />
          ))}
          {vela && (
            deFrente
              // vela de cutelo (vista de frente): estreita e centrada
              ? <path d={`M${CX},${altura(1.15)} L${CX + 5},${topo - 4} L${CX - 5},${topo - 4}Z`} fill={COR.cascoNoite} {...traco} />
              : <path d={`M${CX},${altura(1.15)} L${CX},${topo - 4} L${CX + (proaADireita ? -1 : 1) * Math.max(18, 60 * Math.abs(sin))},${topo - 4}Z`} fill={COR.cascoNoite} {...traco} />
          )}
          {!vela && <rect x={xCabine - larguraCabine / 2} y={topo - 28} width={larguraCabine} height={30} rx={6} fill={COR.cascoNoite} {...traco} />}
          <path d={casco} fill={COR.cascoNoite} {...traco} />
        </g>
        {luzes.map((l) => {
          const p = posLuz(l);
          return <Luz key={l.id} x={p.x} y={p.y} cor={COR_LUZ[l.cor]} r={5} />;
        })}
        <g className={s.revelar}>
          {rotulos.map(({ l, p, lado, tx, ty }) => (
            <Rotulo key={`t-${l.id}`} x={tx} y={ty} anc={lado < 0 ? 'end' : 'start'} alvo={[p.x, p.y]} cor={l.cor === 'branca' ? undefined : COR_LUZ[l.cor]}>
              {NOMES[l.id]!}
            </Rotulo>
          ))}
        </g>
      </g>

      <Ondas y={206} amp={5} comp={70} cor="#0A1F42" opacidade={0.95} dur={8} sentido={1} />
      <Ondas y={232} amp={6} comp={90} cor="#071733" dur={8} />
      <Placa>Noite • visibilidade boa</Placa>
    </svg>
  );
}
