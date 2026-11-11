'use client';

import { useSyncExternalStore } from 'react';
import { CONTAS_ATIVAS, supabase } from '@/lib/conta/supabase';

/*
 * Progresso = histórico de lições concluídas (cada conclusão vale XP).
 * Fica no aparelho; com conta, é enviado ao Supabase (tabela `conclusoes`) e o servidor passa a ser a fonte.
 * Ao sair da conta o aparelho é limpo: o progresso continua na conta.
 */
const CHAVE_V1 = 'bom-marujo:progresso:v1';
const CHAVE = 'bom-marujo:progresso:v2';

export interface Conclusao {
  licao: string;
  xp: number;
  acertos: number;
  total: number;
  /** ISO 8601; junto com a lição identifica a conclusão (evita duplicar no envio) */
  em: string;
  /** já está no servidor */
  enviada?: boolean;
}

export interface Progresso {
  /** última conclusão de cada lição */
  concluidas: Record<string, Conclusao>;
  xp: number;
  historico: Conclusao[];
}

export function derivar(historico: Conclusao[]): Progresso {
  const ordenado = [...historico].sort((a, b) => a.em.localeCompare(b.em));
  const concluidas: Record<string, Conclusao> = {};
  let xp = 0;
  for (const c of ordenado) {
    concluidas[c.licao] = c;
    xp += c.xp;
  }
  return { concluidas, xp, historico: ordenado };
}

/** v1 guardava só a última conclusão de cada lição */
export function migrarV1(v1: { concluidas?: Record<string, Omit<Conclusao, 'licao'>> }): Conclusao[] {
  return Object.entries(v1.concluidas ?? {}).map(([licao, c]) => ({ licao, xp: c.xp, acertos: c.acertos, total: c.total, em: c.em }));
}

const chave = (c: Conclusao) => `${c.licao}|${new Date(c.em).toISOString()}`;

const VAZIO = derivar([]);
let cache: Progresso | null = null;
const ouvintes = new Set<() => void>();

function ler(): Progresso {
  if (cache) return cache;
  try {
    const v2 = localStorage.getItem(CHAVE);
    const v1 = v2 ? null : localStorage.getItem(CHAVE_V1);
    cache = derivar(v2 ? (JSON.parse(v2) as Conclusao[]) : v1 ? migrarV1(JSON.parse(v1)) : []);
  } catch {
    cache = VAZIO;
  }
  return cache;
}

function gravar(historico: Conclusao[]) {
  cache = derivar(historico);
  try {
    localStorage.setItem(CHAVE, JSON.stringify(cache.historico));
    localStorage.removeItem(CHAVE_V1);
  } catch {
    /* modo privado: segue só em memória */
  }
  ouvintes.forEach((f) => f());
}

export function concluirLicao(licao: string, acertos: number, total: number): number {
  const xp = 10 + Math.round((acertos / Math.max(total, 1)) * 5);
  gravar([...ler().historico, { licao, xp, acertos, total, em: new Date().toISOString() }]);
  if (usuarioId) void sincronizar();
  return xp;
}

export function useProgresso(): Progresso {
  return useSyncExternalStore(
    (cb) => {
      ouvintes.add(cb);
      return () => ouvintes.delete(cb);
    },
    ler,
    () => VAZIO,
  );
}

/* ---------- sincronização com a conta ---------- */

let usuarioId: string | null = null;
let emAndamento: Promise<void> | null = null;

/** Chamado pela sessão quando alguém entra ou sai. */
export function definirUsuario(id: string | null) {
  if (id === usuarioId) return;
  const anterior = usuarioId;
  usuarioId = id;
  if (id) void sincronizar();
  else if (anterior) gravar([]);
}

export function sincronizar(): Promise<void> {
  if (!CONTAS_ATIVAS || !usuarioId) return Promise.resolve();
  if (emAndamento) return emAndamento.then(() => sincronizar());
  const uid = usuarioId;
  emAndamento = (async () => {
    const sb = supabase();
    const pendentes = ler().historico.filter((c) => !c.enviada);
    if (pendentes.length) {
      const { error } = await sb.from('conclusoes').upsert(
        pendentes.map((c) => ({ licao_id: c.licao, xp: c.xp, acertos: c.acertos, total: c.total, em: c.em })),
        { onConflict: 'usuario_id,licao_id,em', ignoreDuplicates: true },
      );
      if (error) return console.warn('Progresso não enviado (tenta de novo depois):', error.message);
    }
    const { data, error } = await sb.from('conclusoes').select('licao_id, xp, acertos, total, em');
    if (error || usuarioId !== uid) return;
    const doServidor: Conclusao[] = data.map((r) => ({
      licao: r.licao_id,
      xp: r.xp,
      acertos: r.acertos,
      total: r.total,
      em: new Date(r.em).toISOString(),
      enviada: true,
    }));
    const noServidor = new Set(doServidor.map(chave));
    // conclusões feitas enquanto a sincronização rodava continuam pendentes
    const novas = ler().historico.filter((c) => !c.enviada && !noServidor.has(chave(c)));
    gravar([...doServidor, ...novas]);
  })().finally(() => {
    emAndamento = null;
  });
  return emAndamento;
}
