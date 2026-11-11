import type { CSSProperties } from 'react';

/** Estilos da página interna /revisao (sem CSS próprio: é ferramenta de conferência). */
export const estiloRevisao = {
  selo: { fontSize: 12, fontWeight: 800, color: 'var(--azul)' },
  h3: { margin: '4px 0 10px' },
  duas: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, alignItems: 'start' },
  cena: { border: '3px solid var(--tinta)', borderRadius: 14, overflow: 'hidden', background: '#000' },
  legenda: { fontSize: 12, fontWeight: 800 },
} satisfies Record<string, CSSProperties>;
