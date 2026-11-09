'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { CartaoConceito, Licao, Questao } from '@/content/tipos';
import { Cena } from '@/components/cenas/Cena';
import { SINAIS } from '@/lib/ripeam/sinais';
import { bip, tocarSinal } from '@/lib/audio/apito';
import { concluirLicao } from '@/lib/progresso';
import { Marujo, type Pose } from '@/components/marujo/Marujo';
import s from './licao.module.css';

type Passo = { tipo: 'conceito'; c: CartaoConceito } | { tipo: 'questao'; q: Questao; repeticao?: boolean };

/** Embaralha as alternativas de forma determinística (mesma ordem no servidor e no cliente). */
function embaralhar(q: Questao, sal = ''): Questao {
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

export function LessonPlayer({ licao }: { licao: Licao }) {
  const inicial = useMemo<Passo[]>(
    () => [
      ...licao.conceitos.map((c) => ({ tipo: 'conceito' as const, c })),
      ...licao.questoes.map((q) => ({ tipo: 'questao' as const, q: embaralhar(q) })),
    ],
    [licao],
  );
  const [fila, setFila] = useState<Passo[]>(inicial);
  const [i, setI] = useState(0);
  const [escolha, setEscolha] = useState<number | null>(null);
  const [conferido, setConferido] = useState(false);
  const [acertos, setAcertos] = useState(0);
  const [apitos, setApitos] = useState(0);
  const [fim, setFim] = useState<{ xp: number } | null>(null);
  const [sequencia, setSequencia] = useState(0);
  const [reacao, setReacao] = useState<Pose>('aprovando');

  const passo = fila[i];
  const totalBase = inicial.length;
  const progresso = fim ? 100 : (Math.min(i, totalBase) / totalBase) * 100;
  const ok = passo?.tipo === 'questao' && conferido && escolha === passo.q.correta;

  function avancar() {
    if (i + 1 >= fila.length) {
      const qs = licao.questoes.length;
      setFim({ xp: concluirLicao(licao.id, acertos, qs) });
      return;
    }
    setI(i + 1);
    setEscolha(null);
    setConferido(false);
    setApitos(0);
  }

  function conferir() {
    if (passo?.tipo !== 'questao' || escolha === null) return;
    const certo = escolha === passo.q.correta;
    bip(certo);
    setConferido(true);
    // Reação do Marujo: durão — joinha no acerto, orgulho em sequência, desconfiança no erro, bravo se errar de novo.
    const seq = certo ? sequencia + 1 : 0;
    setSequencia(seq);
    setReacao(certo ? (seq >= 3 ? 'orgulhoso' : 'aprovando') : passo.repeticao ? 'bravo' : 'cetico');
    if (certo && !passo.repeticao) setAcertos((a) => a + 1);
    // Erros voltam no fim da lição (uma vez).
    // (na repetição, outra ordem de alternativas — para não decorar a posição)
    if (!certo && !passo.repeticao) setFila((f) => [...f, { tipo: 'questao', q: embaralhar(passo.q, 'bis'), repeticao: true }]);
  }

  function ouvir(lento = false) {
    if (passo?.tipo !== 'questao' || !passo.q.som) return;
    void tocarSinal(SINAIS[passo.q.som].sinal, { lento, aoApitar: () => setApitos((n) => n + 1) });
  }

  // teclado: 1–4 escolhe, Enter confere/continua
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (fim) return;
      const n = Number(e.key);
      if (passo?.tipo === 'questao' && !conferido && n >= 1 && n <= passo.q.opcoes.length) setEscolha(n - 1);
      if (e.key === 'Enter') {
        if (passo?.tipo === 'conceito' || conferido) avancar();
        else if (escolha !== null) conferir();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (fim) {
    const qs = licao.questoes.length;
    const pct = acertos / qs;
    const [poseFim, frase] =
      pct === 1
        ? (['comemorando', 'Lição perfeita! Até o velho aqui sorriu.'] as const)
        : pct >= 0.7
          ? (['orgulhoso', 'Nada mal, marujo. Nada mal.'] as const)
          : pct >= 0.5
            ? (['aprovando', 'Passou raspando. Revisa esses erros aí.'] as const)
            : (['triste', 'Mar agitado hoje... bora tentar de novo?'] as const);
    return (
      <div className={s.app}>
        <div className={s.fim}>
          <Marujo pose={poseFim} altura={220} prioridade />
          <h1>Lição concluída!</h1>
          <p className={s.sub}>{licao.titulo}</p>
          <p className={s.frase}>“{frase}”</p>
          <div className={s.stats}>
            <div className={s.stat}><span>XP</span><b>+{fim.xp}</b></div>
            <div className={s.stat}><span>Precisão</span><b>{Math.round((acertos / qs) * 100)}%</b></div>
          </div>
          <Link href="/" className={s.principal}>Voltar à trilha</Link>
        </div>
      </div>
    );
  }
  if (!passo) return null;

  return (
    <>
      <div className={s.app}>
        <div className={s.topo}>
          <Link href="/" className={s.fechar} aria-label="Sair da lição">✕</Link>
          <div className={s.progresso}><i style={{ width: `${Math.max(progresso, 3)}%` }} /></div>
        </div>

        {passo.tipo === 'conceito' ? (
          <>
            <div className={s.tag}>✨ Novo conceito</div>
            <h1 className={s.titulo}>{passo.c.titulo}</h1>
            {passo.c.cena && <div className={s.cena}><Cena key={passo.c.id} spec={passo.c.cena} revelado /></div>}
            <p className={s.texto}>{passo.c.texto}</p>
            {passo.c.falaMarujo && (
              <div className={s.marujo}>
                <Marujo key={passo.c.id} pose={passo.c.pose ?? 'ensinando'} altura={130} />
                <div className={s.balao}>{passo.c.falaMarujo}</div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className={s.tag}>{passo.repeticao ? '🔁 Vamos de novo' : licaoTag(licao.temaId)}</div>
            <h1 className={s.titulo}>{passo.q.enunciado}</h1>
            <div className={s.cena}><Cena key={`${passo.q.id}-${i}`} spec={passo.q.cena} revelado={conferido} apitos={apitos} /></div>
            {passo.q.som && (
              <div className={s.som}>
                <Marujo key={`apito-${apitos}`} pose="apito" altura={64} animacao={apitos > 0 ? 'treme' : 'nenhuma'} />
                <button className={s.btnSom} onClick={() => ouvir()}>🔊 Ouvir sinal</button>
                <button className={`${s.btnSom} ${s.lento}`} onClick={() => ouvir(true)} aria-label="Ouvir devagar">🐢</button>
              </div>
            )}
            <div className={s.opcoes}>
              {passo.q.opcoes.map((o, k) => {
                const cls = [s.op];
                if (!conferido && escolha === k) cls.push(s.sel);
                if (conferido && k === passo.q.correta) cls.push(s.certa);
                if (conferido && k === escolha && k !== passo.q.correta) cls.push(s.errada);
                return (
                  <button key={k} className={cls.join(' ')} disabled={conferido} onClick={() => setEscolha(k)}>
                    <span className={s.k}>{k + 1}</span>
                    {o}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      <div className={`${s.rodape} ${conferido ? (ok ? s.rodapeOk : s.rodapeErro) : ''}`}>
        <div className={s.rodapeIn}>
          {conferido && passo.tipo === 'questao' && (
            <div className={s.fb} role="status" aria-live="polite">
              <Marujo key={`r-${i}`} pose={reacao} altura={96} className={s.reacao} />
              <div className={s.ic}>{ok ? '✓' : '✕'}</div>
              <div>
                <b>{TITULO_REACAO[reacao] ?? (ok ? 'Mandou bem, marujo!' : 'Resposta certa:')}</b>
                <p>{(ok ? '' : passo.q.opcoes[passo.q.correta] + '. ') + passo.q.explicacao}</p>
                <span className={s.regra}>{passo.q.referencia}</span>
              </div>
            </div>
          )}
          {passo.tipo === 'conceito' ? (
            <button className={s.principal} onClick={avancar}>Continuar</button>
          ) : conferido ? (
            <button className={s.principal} onClick={avancar}>Continuar</button>
          ) : (
            <button className={s.principal} disabled={escolha === null} onClick={conferir}>Verificar</button>
          )}
        </div>
      </div>
    </>
  );
}

const TITULO_REACAO: Partial<Record<Pose, string>> = {
  aprovando: 'Mandou bem, marujo!',
  orgulhoso: 'É isso aí! Tá virando lobo do mar.',
  cetico: 'Hmm... não foi dessa vez.',
  bravo: 'De novo, marujo?! Presta atenção!',
};

function licaoTag(temaId: string) {
  return (
    { luzes: '💡 Luzes de navegação', sons: '📯 Sinais sonoros', balizamento: '🛟 Balizamento IALA B', marinharia: '🪢 Nós e voltas' }[temaId] ??
    '⚓ Questão'
  );
}
