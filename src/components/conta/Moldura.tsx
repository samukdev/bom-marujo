import Link from 'next/link';
import type { ReactNode } from 'react';
import { Marujo } from '@/components/marujo/Marujo';
import type { Pose } from '@/components/marujo/poses';
import s from './conta.module.css';

/** Cabeçalho comum das telas de conta: voltar, Marujo e título. */
export function Moldura({ titulo, texto, pose = 'continencia', children }: { titulo: string; texto?: ReactNode; pose?: Pose; children: ReactNode }) {
  return (
    <main className={s.app}>
      <Link href="/" className={s.voltar}>← Trilha</Link>
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
