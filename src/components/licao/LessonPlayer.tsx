'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { Cartao, Licao, Tema } from '@/content';
import { bip } from '@/lib/audio/apito';
import { concluirLicao } from '@/lib/progresso';
import { Marujo, type Pose } from '@/components/marujo/Marujo';
import { ehAvaliativo, tipoDe } from './cartoes/registro';
import type { Avaliacao } from './cartoes/tipos';
import s from './licao.module.css';

type Passo = { cartao: Cartao; repeticao?: boolean };

/** Prepara o cartão para a tela (ex.: embaralha alternativas); `sal` muda na repetição. */
function preparar(c: Cartao, sal = ''): Cartao {
  const t = tipoDe(c);
  return t.avaliativo ? t.preparar(c, sal) : c;
}

export function LessonPlayer({ licao, tema }: { licao: Licao; tema?: Tema }) {
  const inicial = useMemo<Passo[]>(() => licao.cartoes.map((c) => ({ cartao: preparar(c) })), [licao]);
  const totalAvaliativos = useMemo(() => licao.cartoes.filter(ehAvaliativo).length, [licao]);
  const [fila, setFila] = useState<Passo[]>(inicial);
  const [i, setI] = useState(0);
  const [resposta, setResposta] = useState<unknown>(null);
  const [avaliacao, setAvaliacao] = useState<Avaliacao | null>(null);
  const [acertos, setAcertos] = useState(0);
  const [fim, setFim] = useState<{ xp: number } | null>(null);
  const [sequencia, setSequencia] = useState(0);
  const [reacao, setReacao] = useState<Pose>('aprovando');

  const passo = fila[i];
  const tipo = passo ? tipoDe(passo.cartao) : null;
  const conferido = avaliacao !== null;
  const ok = avaliacao?.certo ?? false;
  const totalBase = inicial.length;
  const progresso = fim ? 100 : (Math.min(i, totalBase) / totalBase) * 100;

  function avancar() {
    if (i + 1 >= fila.length) {
      setFim({ xp: concluirLicao(licao.id, acertos, totalAvaliativos) });
      return;
    }
    setI(i + 1);
    setResposta(null);
    setAvaliacao(null);
  }

  function conferir() {
    if (!passo || !tipo?.avaliativo || resposta === null || conferido) return;
    const a = tipo.avaliar(passo.cartao, resposta);
    bip(a.certo);
    setAvaliacao(a);
    // Reação do Marujo: durão — joinha no acerto, orgulho em sequência, desconfiança no erro, bravo se errar de novo.
    const seq = a.certo ? sequencia + 1 : 0;
    setSequencia(seq);
    setReacao(a.certo ? (seq >= 3 ? 'orgulhoso' : 'aprovando') : passo.repeticao ? 'bravo' : 'cetico');
    if (a.certo && !passo.repeticao) setAcertos((n) => n + 1);
    // Erros voltam no fim da lição (uma vez), em outra ordem — para não decorar a posição.
    if (!a.certo && !passo.repeticao) {
      const original = licao.cartoes.find((c) => c.id === passo.cartao.id) ?? passo.cartao;
      setFila((f) => [...f, { cartao: preparar(original, 'bis'), repeticao: true }]);
    }
  }

  // teclado: atalhos do tipo (ex.: 1–4 escolhe), Enter confere/continua
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (fim || !passo || !tipo) return;
      if (tipo.avaliativo && !conferido) {
        const r = tipo.respostaPorTecla?.(passo.cartao, e.key);
        if (r !== undefined) setResposta(r);
      }
      if (e.key === 'Enter') {
        if (!tipo.avaliativo || conferido) avancar();
        else if (resposta !== null) conferir();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (fim) {
    const qs = Math.max(totalAvaliativos, 1);
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
  if (!passo || !tipo) return null;

  return (
    <>
      <div className={s.app}>
        <div className={s.topo}>
          <Link href="/" className={s.fechar} aria-label="Sair da lição">✕</Link>
          <div className={s.progresso}><i style={{ width: `${Math.max(progresso, 3)}%` }} /></div>
        </div>

        <div className={s.tag}>{!tipo.avaliativo ? tipo.rotulo : passo.repeticao ? '🔁 Vamos de novo' : (tema ? `${tema.icone} ${tema.titulo}` : '⚓ Questão')}</div>
        <tipo.Tela cartao={passo.cartao} resposta={resposta} responder={setResposta} conferido={conferido} chave={String(i)} />
      </div>

      <div className={`${s.rodape} ${conferido ? (ok ? s.rodapeOk : s.rodapeErro) : ''}`}>
        <div className={s.rodapeIn}>
          {avaliacao && (
            <div className={s.fb} role="status" aria-live="polite">
              <Marujo key={`r-${i}`} pose={reacao} altura={96} className={s.reacao} />
              <div className={s.ic}>{ok ? '✓' : '✕'}</div>
              <div>
                <b>{TITULO_REACAO[reacao] ?? (ok ? 'Mandou bem, marujo!' : 'Resposta certa:')}</b>
                <p>{(ok ? '' : avaliacao.respostaCerta + '. ') + avaliacao.explicacao}</p>
                <span className={s.regra}>{avaliacao.referencia}</span>
              </div>
            </div>
          )}
          {!tipo.avaliativo || conferido ? (
            <button className={s.principal} onClick={avancar}>Continuar</button>
          ) : (
            <button className={s.principal} disabled={resposta === null} onClick={conferir}>Verificar</button>
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

