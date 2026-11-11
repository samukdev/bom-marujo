'use client';

import type { CartaoDe } from '@/content';
import { Cena } from '@/components/cenas/Cena';
import { CenaInterativa } from '@/components/cenas/CenaInterativa';
import { SINAIS, notacao } from '@/lib/ripeam/sinais';
import type { TipoAvaliativo } from './tipos';
import { estiloRevisao as r } from './revisao';
import s from '../licao.module.css';

type C = CartaoDe<'multipla-escolha'>;

/** Embaralha as alternativas de forma determinística (mesma ordem no servidor e no cliente). */
function embaralhar(q: C, sal: string): C {
  let h = 2166136261;
  for (const ch of q.id + sal) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const idx = q.opcoes.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    const j = (h >>> 0) % (i + 1);
    [idx[i], idx[j]] = [idx[j]!, idx[i]!];
  }
  return { ...q, opcoes: idx.map((i) => q.opcoes[i]!), correta: idx.indexOf(q.correta) };
}

export const multiplaEscolha: TipoAvaliativo<C, number> = {
  avaliativo: true,
  preparar: embaralhar,
  respostaPorTecla: (q, tecla) => {
    const n = Number(tecla);
    return n >= 1 && n <= q.opcoes.length ? n - 1 : undefined;
  },
  avaliar: (q, escolha) => ({
    certo: escolha === q.correta,
    respostaCerta: q.opcoes[q.correta]!,
    explicacao: q.explicacao,
    referencia: q.referencia,
  }),
  Tela: ({ cartao: q, resposta, responder, conferido, chave }) => (
    <>
      <h1 className={s.titulo}>{q.enunciado}</h1>
      <CenaInterativa key={`${q.id}-${chave}`} spec={q.cena} revelado={conferido} som={q.som} />
      <div className={s.opcoes}>
        {q.opcoes.map((o, k) => {
          const cls = [s.op];
          if (!conferido && resposta === k) cls.push(s.sel);
          if (conferido && k === q.correta) cls.push(s.certa);
          if (conferido && k === resposta && k !== q.correta) cls.push(s.errada);
          return (
            <button key={k} className={cls.join(' ')} disabled={conferido} onClick={() => responder(k)}>
              <span className={s.k}>{k + 1}</span>
              {o}
            </button>
          );
        })}
      </div>
    </>
  ),
  Revisao: ({ cartao: q }) => (
    <>
      <div style={r.selo}>QUESTÃO · {q.id}{q.som ? ` · som: ${notacao(SINAIS[q.som].sinal)} (${q.som})` : ''}</div>
      <h3 style={r.h3}>{q.enunciado}</h3>
      <div style={r.duas}>
        <div><div style={r.legenda}>ANTES da resposta</div><div style={r.cena}><Cena spec={q.cena} /></div></div>
        <div><div style={r.legenda}>DEPOIS da resposta</div><div style={r.cena}><Cena spec={q.cena} revelado apito={{ n: 1, dur: 1 }} /></div></div>
      </div>
      <ol style={{ margin: '10px 0 6px' }}>
        {q.opcoes.map((o, i) => (
          <li key={i} style={{ fontWeight: i === q.correta ? 900 : 600, color: i === q.correta ? 'var(--ok-escuro)' : undefined }}>
            {o} {i === q.correta && '✓'}
          </li>
        ))}
      </ol>
      <p style={{ margin: '4px 0', lineHeight: 1.45 }}><b>Explicação:</b> {q.explicacao}</p>
      <p style={{ margin: 0, fontSize: 13, color: 'var(--texto-2)' }}>{q.referencia}</p>
    </>
  ),
};
