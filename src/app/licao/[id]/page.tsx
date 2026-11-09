import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { LICOES, getLicao } from '@/content/licoes';
import { LessonPlayer } from '@/components/licao/LessonPlayer';

export function generateStaticParams() {
  return LICOES.map((l) => ({ id: l.id }));
}

async function Conteudo({ params }: { params: PageProps<'/licao/[id]'>['params'] }) {
  const { id } = await params;
  const licao = getLicao(id);
  if (!licao) notFound();
  return <LessonPlayer licao={licao} />;
}

// URL data fica atrás de Suspense para a navegação ser instantânea (Next 16 / Cache Components).
export default function Page({ params }: PageProps<'/licao/[id]'>) {
  return (
    <Suspense fallback={<div style={{ padding: 32, textAlign: 'center' }}>⚓</div>}>
      <Conteudo params={params} />
    </Suspense>
  );
}
