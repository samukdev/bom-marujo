import { luzesExibidas, luzesVisiveis, projetarX, type EmbarcacaoSpec, type LuzDef } from '@/lib/ripeam/luzes';
import { COR_LUZ, Defs, Luz, Ondas, Rotulo } from './comum';
import s from './cenas.module.css';

const L = 190; // comprimento na tela (px)
const B = 96; // boca na tela (px) — exagerada para leitura
const CX = 200;
const WL = 182; // linha d'água
const CASCO = '#16264A';
const CONTORNO = '#3A5A8F';

const NOMES: Record<string, string> = {
  'mastro-av': 'MASTRO',
  'mastro-ar': 'MASTRO DE RÉ',
  'bordo-be': 'BORESTE',
  'bordo-bb': 'BOMBORDO',
  alcancado: 'ALCANÇADO',
  fundeio: 'FUNDEIO',
  'fundeio-av': 'FUNDEIO',
  'fundeio-ar': 'FUNDEIO',
  'sg-sup': 'SEM GOVERNO',
  'arr-sup': 'ARRASTO',
};

const px = (f: number, sl: number, a: number) => CX + projetarX(f * L, sl * B, a);
const altura = (h: number) => WL - 24 - h * 104;

export function CenaLuzesNoite({ embarcacao, aspecto }: { embarcacao: EmbarcacaoSpec; aspecto: number }) {
  const rad = (aspecto * Math.PI) / 180;
  const sin = Math.sin(rad);
  const luzes = luzesVisiveis(embarcacao, aspecto);

  // silhueta do casco a partir dos cantos projetados
  const xs = [px(0.5, 0, aspecto), px(-0.5, 0.5, aspecto), px(-0.5, -0.5, aspecto), px(0.2, 0.5, aspecto), px(0.2, -0.5, aspecto)];
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const deDeFrente = Math.abs(sin) < 0.35;
  const proaADireita = sin > 0;
  const topo = WL - 22;
  const fundo = WL + 8;
  const casco = deDeFrente
    ? `M${minX},${topo} L${maxX},${topo} L${CX + (maxX - CX) * 0.4},${fundo} L${CX + (minX - CX) * 0.4},${fundo}Z`
    : proaADireita
      ? `M${minX},${topo} L${maxX + 8},${topo - 6} L${maxX - 28},${fundo} L${minX + 4},${fundo}Z`
      : `M${minX - 8},${topo - 6} L${maxX},${topo} L${maxX - 4},${fundo} L${minX + 28},${fundo}Z`;
  const larguraCabine = 0.32 * L * Math.abs(sin) + 0.6 * B * Math.abs(Math.cos(rad));
  const xCabine = px(0.02, 0, aspecto);

  // mastros: um por luz alta (h ≥ 0.6) distinta em f
  // (silhueta usa TODAS as luzes exibidas — o mastro existe mesmo quando a luz dele não é visível)
  const mastros = Array.from(new Set(luzesExibidas(embarcacao).filter((l) => l.h >= 0.6).map((l) => l.f)));
  const temSilhuetaVela = embarcacao.tipo === 'vela';

  const estrelas = [];
  for (let i = 0; i < 28; i++) {
    estrelas.push(
      <circle key={i} className={s.estrela} style={{ animationDelay: `${(i % 7) * 0.4}s` }}
        cx={(i * 137) % 400} cy={((i * 53) % 120) + 6} r={(i % 3) * 0.5 + 0.6} fill="#fff" opacity={0.8} />,
    );
  }

  const posLuz = (l: LuzDef) => ({ x: px(l.f, l.s, aspecto), y: altura(l.h) });

  return (
    <svg className={s.svg} viewBox="0 0 400 260" role="img" aria-label="Cena noturna com as luzes de uma embarcação">
      <Defs />
      <linearGradient id="ceuN" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#050D1F" />
        <stop offset="1" stopColor="#14305E" />
      </linearGradient>
      <rect width="400" height="260" fill="url(#ceuN)" />
      {estrelas}
      <circle cx="340" cy="36" r="15" fill="#F5F1E6" />
      <circle cx="347" cy="31" r="14" fill="#08142B" />
      <rect y="150" width="400" height="110" fill="#0C2348" />
      <Ondas y={152} amp={3} comp={60} cor="#0F2B57" dur={9} />

      <g className={s.balanca} style={{ transformOrigin: `${CX}px ${WL}px` }}>
        {/* reflexos na água */}
        {luzes.map((l) => {
          const p = posLuz(l);
          return (
            <rect key={`r-${l.id}`} className={s.reflexo} x={p.x - 4} y={WL + 10} width={8} height={30 + l.h * 30} rx={4}
              fill={COR_LUZ[l.cor]} opacity={0.45} filter="url(#blurG)" />
          );
        })}
        {/* silhueta */}
        {mastros.map((f) => (
          <rect key={`m-${f}`} x={px(f, 0, aspecto) - 2} y={altura(1) - 4} width={4} height={topo - altura(1) + 4} fill="#22385F" stroke={CONTORNO} strokeWidth={1} />
        ))}
        {temSilhuetaVela && (
          <path
            d={`M${CX},${altura(1.15)} L${CX},${topo - 4} L${CX + (proaADireita ? -1 : 1) * Math.max(18, 60 * Math.abs(sin))},${topo - 4}Z`}
            fill="#1B2D4F" stroke={CONTORNO} strokeWidth={2} strokeLinejoin="round"
          />
        )}
        {temSilhuetaVela && <rect x={CX - 1.5} y={altura(1.15)} width={3} height={topo - altura(1.15)} fill="#22385F" />}
        {!temSilhuetaVela && (
          <rect x={xCabine - larguraCabine / 2} y={topo - 28} width={larguraCabine} height={30} rx={6} fill="#1B2D4F" stroke={CONTORNO} strokeWidth={2} />
        )}
        <path d={casco} fill={CASCO} stroke={CONTORNO} strokeWidth={2.5} strokeLinejoin="round" />
        {luzes.map((l) => {
          const p = posLuz(l);
          return <Luz key={l.id} x={p.x} y={p.y} cor={COR_LUZ[l.cor]} r={5} />;
        })}
        {/* rótulos (aparecem depois da resposta) */}
        <g className={s.revelar}>
          {luzes.filter((l) => NOMES[l.id]).map((l, i) => {
            const p = posLuz(l);
            const lado = p.x < CX - 4 ? -1 : p.x > CX + 4 ? 1 : i % 2 ? -1 : 1;
            const tx = p.x + lado * 40;
            const ty = p.y - 22;
            return (
              <g key={`t-${l.id}`}>
                <line x1={p.x} y1={p.y} x2={tx} y2={ty + 4} stroke="#fff" strokeWidth={1.2} />
                <Rotulo x={tx} y={ty} anc={lado < 0 ? 'end' : 'start'} cor={l.cor === 'branca' ? '#fff' : COR_LUZ[l.cor]}>
                  {NOMES[l.id]!}
                </Rotulo>
              </g>
            );
          })}
        </g>
      </g>

      <Ondas y={206} amp={5} comp={70} cor="#0A1F42" opacidade={0.95} dur={7} sentido={1} />
      <Ondas y={232} amp={6} comp={90} cor="#071733" dur={6} />
      <text x={16} y={250} fontWeight={800} fontSize={10} fill="#7F9CCB" style={{ fontFamily: 'var(--fonte)' }}>
        NOITE • VISIBILIDADE BOA
      </text>
    </svg>
  );
}
