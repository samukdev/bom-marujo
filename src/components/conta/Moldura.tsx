'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { Marujo } from '@/components/marujo/Marujo';
import type { Pose } from '@/components/marujo/poses';
import { useSessao } from '@/lib/conta/sessao';
import s from './conta.module.css';

/** Cabeçalho comum das telas de conta: voltar, Marujo e título. */
export function Moldura({ titulo, texto, pose = 'continencia', children }: { titulo: string; texto?: ReactNode; pose?: Pose; children: ReactNode }) {
  const { usuario } = useSessao();
  const naTelaDeEntrar = usePathname().startsWith('/entrar');
  // sem conta a trilha manda para /entrar, então o voltar aponta direto para lá
  const voltar = usuario ? { href: '/', texto: '← Trilha' } : naTelaDeEntrar ? null : { href: '/entrar', texto: '← Entrar' };
  return (
    <main className={s.app}>
      {voltar && <Link href={voltar.href} className={s.voltar}>{voltar.texto}</Link>}
      <div className={s.topo}>
        <Marujo pose={pose} altura={110} prioridade />
        <div>
          <h1>{titulo}</h1>
          {texto && <p>{texto}</p>}
        </div>
      </div>
      {children}
    </main>
  );
}
