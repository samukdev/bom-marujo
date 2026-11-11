'use client';

import type { CSSProperties } from 'react';
import type { Licao } from '@/content';
import { tipoDe } from './registro';

const card: CSSProperties = { background: 'var(--card)', border: '2px solid var(--borda)', borderRadius: 16, padding: 14, marginBottom: 18 };

/** Todas as lições na página interna /revisao, cada cartão com o `Revisao` do seu tipo. */
export function ListaRevisao({ licoes }: { licoes: Licao[] }) {
  return licoes.map((l) => (
    <section key={l.id}>
      <h2 style={{ fontWeight: 900, marginTop: 28 }}>{l.titulo} <small style={{ color: 'var(--texto-2)' }}>({l.id} · tema {l.temaId})</small></h2>
      {l.cartoes.map((c) => {
        const { Revisao: Item } = tipoDe(c);
        return (
          <article key={c.id} data-item={`${l.id}/${c.id}`} style={card}>
            <Item cartao={c} />
          </article>
        );
      })}
    </section>
  ));
}
