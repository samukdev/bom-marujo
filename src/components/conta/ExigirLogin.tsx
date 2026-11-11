'use client';

import { useEffect, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Marujo } from '@/components/marujo/Marujo';
import { useSessao } from '@/lib/conta/sessao';
import { CONTAS_ATIVAS } from '@/lib/conta/supabase';

/** Telas abertas sem conta; o resto do app exige login. */
const PUBLICAS = ['/entrar', '/cadastro', '/esqueci-senha', '/redefinir-senha', '/perfil'];

const publica = (caminho: string) => PUBLICAS.some((p) => caminho === p || caminho.startsWith(`${p}/`));

export function ExigirLogin({ children }: { children: ReactNode }) {
  const caminho = usePathname();
  const router = useRouter();
  const { usuario, carregando } = useSessao();
  const livre = !CONTAS_ATIVAS || publica(caminho);

  useEffect(() => {
    if (!livre && !carregando && !usuario) router.replace('/entrar/');
  }, [livre, carregando, usuario, router]);

  if (livre || usuario) return children;
  return (
    <div style={{ minHeight: '100dvh', display: 'grid', placeItems: 'center' }}>
      <Marujo pose="pensando" altura={160} />
    </div>
  );
}
