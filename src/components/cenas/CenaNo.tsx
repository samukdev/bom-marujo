import type { CSSProperties, ReactNode } from 'react';
import {
  caminho, cruzamentos, geometria, recorte, trancado, trechosNaFrente,
  type Amostra, type CaboGeo, type Trecho,
} from '@/lib/nos/geometria';
import { NOS, type NoId } from '@/lib/nos/catalogo';
import { INK, Rotulo } from './comum';
import s from './cenas.module.css';

const CORES = [
  { corpo: '#D9A75E', claro: '#F7DDA6', listra: '#9A672C' }, // manilha
  { corpo: '#3F7DD8', claro: '#AACCF7', listra: '#1D4C9B' }, // sintético azul (segundo cabo)
];
type Cor = (typeof CORES)[number];

const DURACAO = 3.2; // s para "dar" o nó inteiro
const LARGURA = 12; // corpo do cabo

/** Um pedaço de cabo desenhado: sombra, contorno, corpo, volume, trança e (opcional) falcaça nas pontas. */
function Peca({
  id, a, cor, pontas, sombra, animar, atraso, duracao,
}: {
  id: string; a: Amostra[]; cor: Cor; pontas: 'round' | 'butt'; sombra?: boolean;
  animar: boolean; atraso: number; duracao: number;
}) {
  if (a.length < 2) return null;
  const d = caminho(a);
  const ini = a[0]!.s, fim = a[a.length - 1]!.s, len = fim - ini;
  const falcacas = pontas === 'round' ? [recorte(a, ini + 2, ini + 9), recorte(a, fim - 9, fim - 2)] : [];
  const sombraEl = sombra && (
    <path
      d={d} transform="translate(3,5)" fill="none" stroke={INK} strokeOpacity={0.16} strokeWidth={LARGURA + 4} strokeLinecap="round" strokeLinejoin="round"
      className={animar ? s.noSombra : undefined}
      style={animar ? { animationDelay: `${atraso + duracao}s` } : undefined}
    />
  );
  const corpo = (
    <>
      <path d={d} fill="none" stroke={INK} strokeWidth={LARGURA + 4.5} strokeLinecap={pontas} strokeLinejoin="round" />
      <path d={d} fill="none" stroke={cor.corpo} strokeWidth={LARGURA} strokeLinecap={pontas} strokeLinejoin="round" />
      <path d={d} fill="none" stroke={cor.claro} strokeOpacity={0.55} strokeWidth={LARGURA * 0.38} strokeLinecap={pontas} strokeLinejoin="round" />
      <path d={trancado(a, LARGURA / 2 - 1, 6.5, 6)} fill="none" stroke={cor.listra} strokeWidth={1.7} strokeLinecap="round" strokeOpacity={0.85} />
      {falcacas.map((f, i) => (
        <g key={i}>
          <path d={caminho(f)} fill="none" stroke="#F2EBDD" strokeWidth={LARGURA + 0.5} strokeLinecap="butt" />
          <path d={trancado(f, LARGURA / 2 - 1, 2.2, 0)} fill="none" stroke="#B9AE98" strokeWidth={1} />
        </g>
      ))}
    </>
  );
  if (!animar) return <g>{sombraEl}{corpo}</g>;
  // A máscara tem exatamente a largura do cabo (mais larga, ela "vazaria" nos cruzamentos e
  // mostraria pedaços de trechos que o cabo ainda não alcançou). A sombra aparece no fim.
  const revela = {
    d, pathLength: len, fill: 'none', stroke: '#fff', strokeWidth: LARGURA + 5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
    className: s.noBase,
    // começa 12 px "antes" do caminho: a ponta redonda de um traço de comprimento zero desenharia uma bolinha
    style: { strokeDasharray: `${len} ${len + 24}`, '--L': len + 12, animationDelay: `${atraso}s`, animationDuration: `${Math.max(duracao, 0.05)}s` } as CSSProperties,
  };
  return (
    <g>
      <mask id={id} maskUnits="userSpaceOnUse" x="-20" y="-20" width="440" height="300">
        <path {...revela} />
      </mask>
      {sombraEl}
      <g mask={`url(#${id})`}>{corpo}</g>
    </g>
  );
}

/** Cabo enrolado com "?" — mostrado antes da resposta quando a pergunta é "qual nó usar". */
function CaboEnrolado() {
  const voltas = [22, 38, 54, 70].map((r) => {
    const pts: [number, number, number][] = Array.from({ length: 41 }, (_, i) => {
      const t = (i / 40) * Math.PI * 2;
      return [200 + Math.cos(t) * r * 1.5, 135 + Math.sin(t) * r, 0];
    });
    return geometria(pts);
  });
  const ponta = geometria([[200 + 70 * 1.5, 135, 0], [330, 180, 0], [380, 175, 0]]);
  return (
    <svg className={s.svg} viewBox="0 0 400 260" role="img" aria-label="Cabo enrolado: qual nó usar?">
      <rect width="400" height="260" fill="#F5F1E6" />
      {[...voltas, ponta].map((g, i) => (
        <Peca key={i} id={`enrolado-${i}`} a={g.amostras} cor={CORES[0]!} pontas="round" sombra animar={false} atraso={0} duracao={0} />
      ))}
      <g transform="translate(200,135)">
        <circle r="26" fill="var(--azul)" stroke={INK} strokeWidth="3.5" />
        <text y="11" textAnchor="middle" fontSize="32" fontWeight="900" fill="#fff" style={{ fontFamily: 'var(--fonte)' }}>?</text>
      </g>
    </svg>
  );
}

export function CenaNo({
  no, animar = true, revelado = false, oculto = false, prefixo = '',
}: { no: NoId; animar?: boolean; revelado?: boolean; oculto?: boolean; prefixo?: string }) {
  if (oculto) return <CaboEnrolado />;
  const def = NOS[no];
  const geos: CaboGeo[] = def.cabos.map((c) => geometria(c.pontos));
  const temObjeto = Boolean(def.objeto);
  const frente = temObjeto ? trechosNaFrente(geos) : [];
  const cruz = cruzamentos(geos).filter((c) => !temObjeto || c.z > 0.15 || c.z < -0.15);
  const corDe = (cabo: number) => CORES[def.cabos[cabo]!.cor ?? cabo]!;

  const remendo = (t: Trecho, k: string) => {
    const L = geos[t.cabo]!.comprimento;
    return (
      <Peca
        key={k} id={`${prefixo}${no}-${k}`} a={recorte(geos[t.cabo]!.amostras, t.ini, t.fim)} cor={corDe(t.cabo)} pontas="butt"
        animar={animar} atraso={(t.ini / L) * DURACAO} duracao={((t.fim - t.ini) / L) * DURACAO}
      />
    );
  };

  return (
    <svg className={s.svg} viewBox="0 0 400 260" role="img" aria-label={`Desenho do nó: ${def.nome}`}>
      <rect width="400" height="260" fill="#F5F1E6" />
      <g opacity=".07" stroke={INK}>
        {Array.from({ length: 16 }, (_, i) => <line key={i} x1={i * 30} y1="0" x2={i * 30 - 80} y2="260" strokeWidth="1" />)}
      </g>
      {def.fundo as ReactNode}
      {geos.map((g, i) => (
        <Peca key={`b${i}`} id={`${prefixo}${no}-b${i}`} a={g.amostras} cor={corDe(i)} pontas="round" sombra animar={animar} atraso={0} duracao={DURACAO} />
      ))}
      {def.objeto as ReactNode}
      {frente.map((t, i) => remendo(t, `f${i}`))}
      {cruz.map((t, i) => remendo(t, `c${i}`))}
      {def.rotulos && (
        <g className={s.revelar} style={revelado ? { opacity: 1 } : undefined}>
          {def.rotulos.map((r, i) => (
            <Rotulo key={i} x={r[0]} y={r[1]} anc={r[3] ?? 'middle'}>{r[2]}</Rotulo>
          ))}
        </g>
      )}
    </svg>
  );
}
