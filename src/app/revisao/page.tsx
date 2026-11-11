import { LICOES } from '@/content';
import { ListaRevisao } from '@/components/licao/cartoes/ListaRevisao';

export const metadata = { title: 'Revisão de conteúdo · Bom Marujo', robots: { index: false } };

/** Página interna de revisão: todo o conteúdo das lições, cena antes e depois da resposta. */
export default function Revisao() {
  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: 16 }}>
      <h1 style={{ fontWeight: 900 }}>Revisão de conteúdo</h1>
      <ListaRevisao licoes={LICOES} />
    </main>
  );
}
