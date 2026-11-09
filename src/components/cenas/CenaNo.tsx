'use client';

import type { CSSProperties, ReactNode } from 'react';
import {
  caminho, cruzamentos, geometria, recorte, trancado, trechosNaFrente,
  type Amostra, type CaboGeo, type Trecho,
} from '@/lib/nos/geometria';
import { NOS, type NoId } from '@/lib/nos/catalogo';
import { DiscoPergunta, INK, Placa, Rotulo, useIdCena } from './comum';
import { COR } from './tokens';
import s from './cenas.module.css';

const CORES = [
  { corpo: '#D9A75E', claro: '#F7DDA6', listra: '#9A672C' }, // manilha
  { corpo: '#3F7DD8', claro: '#AACCF7', listra: '#1D4C9B' }, // sintético azul (segundo cabo)
];
type Cor = (typeof CORES)[number];

const DURACAO = 2.4; // s para "dar" o nó inteiro (TEMPO.acao)
const LARGURA_PADRAO = 12; // corpo do cabo

/** Um pedaço de cabo desenhado: sombra, contorno, corpo, volume, trança e (opcional) falcaça nas pontas. */
function Peca({
  id, a, inteiro, cor, pontas, sombra, animar, atraso, duracao, chicotes = [false, false], largura,
}: {
  /** a: o pedaço a desenhar; inteiro: o cabo todo (para a trança emendar sem costura) */
  id: string; a: Amostra[]; inteiro?: Amostra[]; cor: Cor; pontas: 'round' | 'butt'; sombra?: boolean;
  animar: boolean; atraso: number; duracao: number;
  /** num remendo (pontas retas), se o início/fim coincide com a ponta do cabo: arredonda e põe falcaça */
  chicotes?: [boolean, boolean];
  /** bitola do cabo (px do corpo) */
  largura?: number;
}) {
  const LARGURA = largura ?? LARGURA_PADRAO;
  if (a.length < 2) return null;
  const d = caminho(a);
  const ini = a[0]!.s, fim = a[a.length - 1]!.s, len = fim - ini;
  const redondo = pontas === 'round';
  const temChicote: [boolean, boolean] = [redondo || chicotes[0], redondo || chicotes[1]];
  const falcacas = [
    temChicote[0] ? recorte(a, ini + 2, ini + 9) : [],
    temChicote[1] ? recorte(a, fim - 9, fim - 2) : [],
  ].filter((f) => f.length > 1);
  // tampinha redonda na ponta de um remendo: contorno ANTES do corpo (para não riscar o corpo), corpo depois
  const tampas = !redondo
    ? [temChicote[0] ? recorte(a, ini, ini + 1) : [], temChicote[1] ? recorte(a, fim - 1, fim) : []].filter((t) => t.length > 1)
    : [];
  const sombraEl = sombra && (
    <path
      d={d} transform="translate(3,5)" fill="none" stroke={INK} strokeOpacity={0.16} strokeWidth={LARGURA + 4} strokeLinecap="round" strokeLinejoin="round"
      className={animar ? s.noSombra : undefined}
      style={animar ? { animationDelay: `${atraso + duracao}s` } : undefined}
    />
  );
  const corpo = (
    <>
      {tampas.map((t, i) => <path key={`to${i}`} d={caminho(t)} fill="none" stroke={INK} strokeWidth={LARGURA + 4.5} strokeLinecap="round" />)}
      <path d={d} fill="none" stroke={INK} strokeWidth={LARGURA + 4.5} strokeLinecap={pontas} strokeLinejoin="round" />
      {tampas.map((t, i) => <path key={`tc${i}`} d={caminho(t)} fill="none" stroke={cor.corpo} strokeWidth={LARGURA} strokeLinecap="round" />)}
      <path d={d} fill="none" stroke={cor.corpo} strokeWidth={LARGURA} strokeLinecap={pontas} strokeLinejoin="round" />
      <path d={d} fill="none" stroke={cor.claro} strokeOpacity={0.55} strokeWidth={LARGURA * 0.38} strokeLinecap={pontas} strokeLinejoin="round" />
      <path
        // só listras inteiras dentro do pedaço (uma listra "pendurada" fora dele ficaria solta sobre outro cabo)
        d={trancado(inteiro ?? a, LARGURA / 2 - 2, 6.5, 6, ini, fim - 6)}
        fill="none" stroke={cor.listra} strokeWidth={1.7} strokeLinecap="butt" strokeOpacity={0.85}
      />
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

/** Bancada (papel com hachura): fundo de todas as cenas de nó. */
function Bancada() {
  return (
    <>
      <rect width="400" height="260" fill={COR.papel} />
      <g opacity=".07" stroke={INK}>
        {Array.from({ length: 16 }, (_, i) => <line key={i} x1={i * 30} y1="0" x2={i * 30 - 80} y2="260" strokeWidth="1" />)}
      </g>
    </>
  );
}

/** Fantasma (placeholder único): mesma bancada, cabo enrolado em tinta a 15% e o disco "?". */
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
    <svg className={s.svg} viewBox="0 0 400 260" role="img" aria-label="Qual nó usar?">
      <Bancada />
      <g opacity={0.15}>
        {[...voltas, ponta].map((g, i) => (
          <path key={i} d={caminho(g.amostras)} fill="none" stroke={INK} strokeWidth={LARGURA_PADRAO + 4.5} strokeLinecap="round" />
        ))}
      </g>
      <DiscoPergunta x={200} y={135} />
      <Placa>Marinharia • qual nó?</Placa>
    </svg>
  );
}

export function CenaNo({
  no, animar = true, revelado = false, oculto = false,
}: { no: NoId; animar?: boolean; revelado?: boolean; oculto?: boolean }) {
  const idc = useIdCena();
  if (oculto) return <CaboEnrolado />;
  const def = NOS[no];
  const geos: CaboGeo[] = def.cabos.map((c) => geometria(c.pontos));
  const temObjeto = Boolean(def.objeto);
  const larguras = def.cabos.map((c) => c.largura ?? LARGURA_PADRAO);
  const frente = temObjeto ? trechosNaFrente(geos) : [];
  // Remendos de cruzamento vão até os cabos se separarem, sem parar por causa do objeto. Com objeto,
  // cada remendo é desenhado inteiro, mas só FORA da silhueta (máscara); a parte com z > 0,15
  // (na frente do objeto) é desenhada também sem máscara.
  const cruz = cruzamentos(geos, larguras);
  const corDe = (cabo: number) => CORES[def.cabos[cabo]!.cor ?? cabo]!;
  const idFora = idc('fora');

  const peca = (t: Trecho, k: string) => {
    const L = geos[t.cabo]!.comprimento;
    return (
      <Peca
        key={k} id={idc(`m-${k}`)} a={recorte(geos[t.cabo]!.amostras, t.ini, t.fim)} inteiro={geos[t.cabo]!.amostras}
        cor={corDe(t.cabo)} pontas="butt" chicotes={[t.ini <= 0.5, t.fim >= L - 0.5]} largura={larguras[t.cabo]}
        animar={animar} atraso={(t.ini / L) * DURACAO} duracao={((t.fim - t.ini) / L) * DURACAO}
      />
    );
  };
  const remendo = (t: Trecho, k: string) => {
    if (!def.silhueta) return peca(t, k);
    // sub-trechos na frente do objeto (z > 0,15) dentro do remendo
    const frentes: Trecho[] = [];
    let ini: number | null = null;
    const am = recorte(geos[t.cabo]!.amostras, t.ini, t.fim);
    am.forEach((p, i) => {
      const f = p.z > 0.15;
      if (f && ini === null) ini = p.s;
      if (ini !== null && (!f || i === am.length - 1)) { frentes.push({ ...t, ini, fim: p.s }); ini = null; }
    });
    return (
      <g key={k}>
        <g mask={`url(#${idFora})`}>{peca(t, `${k}m`)}</g>
        {frentes.map((f, i) => peca(f, `${k}f${i}`))}
      </g>
    );
  };

  return (
    <svg className={s.svg} viewBox="0 0 400 260" role="img" aria-label={`Desenho do nó: ${def.nome}`}>
      <Bancada />
      {def.silhueta && (
        <mask id={idFora} maskUnits="userSpaceOnUse" x="0" y="0" width="400" height="260">
          <rect width="400" height="260" fill="#fff" />
          <path d={def.silhueta} fill="#000" stroke="#000" strokeWidth={4} />
        </mask>
      )}
      {def.fundo as ReactNode}
      {geos.map((g, i) => (
        <Peca key={`b${i}`} id={idc(`m-b${i}`)} a={g.amostras} cor={corDe(i)} pontas="round" sombra animar={animar} atraso={0} duracao={DURACAO} largura={larguras[i]} />
      ))}
      {def.objeto as ReactNode}
      {frente.map((t, i) => peca(t, `f${i}`))}
      {cruz.map((t, i) => remendo(t, `c${i}`))}
      {def.rotulos && (
        <g className={s.revelar}>
          {def.rotulos.map((r, i) => (
            <Rotulo key={i} x={r[0]} y={r[1]} anc={r[3] ?? 'middle'} alvo={r[4]}>{r[2]}</Rotulo>
          ))}
        </g>
      )}
      <Placa>{revelado ? `Marinharia • ${def.nome}` : 'Marinharia'}</Placa>
    </svg>
  );
}
