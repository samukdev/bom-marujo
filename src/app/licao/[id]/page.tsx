import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { LICOES, TEMAS, getLicao } from '@/content';
import { LessonPlayer } from '@/components/licao/LessonPlayer';
import { Marujo } from '@/components/marujo/Marujo';

export function generateStaticParams() {
  return LICOES.map((l) => ({ id: l.id }));
}

async function Conteudo({ params }: { params: PageProps<'/licao/[id]'>['params'] }) {
  const { id } = await params;
  const licao = getLicao(id);
  if (!licao) notFound();
  return <LessonPlayer licao={licao} tema={TEMAS.find((t) => t.id === licao.temaId)} />;
}

// URL data fica atrás de Suspense para a navegação ser instantânea (Next 16 / Cache Components).
export default function Page({ params }: PageProps<'/licao/[id]'>) {
  return (
    <Suspense
      fallback={
        <div style={{ padding: 48, display: 'grid', justifyItems: 'center' }}>
          <Marujo pose="pensando" altura={160} />
        </div>
      }
    >
      <Conteudo params={params} />
    </Suspense>
  );
}
