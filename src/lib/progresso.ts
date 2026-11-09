'use client';

import { useSyncExternalStore } from 'react';

/** Progresso local (MVP). Será trocado por IndexedDB/Dexie na Fase 4. */
const CHAVE = 'bom-marujo:progresso:v1';

export interface Progresso {
  concluidas: Record<string, { xp: number; acertos: number; total: number; em: string }>;
  xp: number;
}

const VAZIO: Progresso = { concluidas: {}, xp: 0 };
let cache: Progresso | null = null;
const ouvintes = new Set<() => void>();

function ler(): Progresso {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(CHAVE);
    cache = raw ? (JSON.parse(raw) as Progresso) : VAZIO;
  } catch {
    cache = VAZIO;
  }
  return cache;
}

export function concluirLicao(id: string, acertos: number, total: number): number {
  const xp = 10 + Math.round((acertos / Math.max(total, 1)) * 5);
  const atual = ler();
  cache = {
    xp: atual.xp + xp,
    concluidas: { ...atual.concluidas, [id]: { xp, acertos, total, em: new Date().toISOString() } },
  };
  try {
    localStorage.setItem(CHAVE, JSON.stringify(cache));
  } catch {
    /* modo privado: segue só em memória */
  }
  ouvintes.forEach((f) => f());
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
