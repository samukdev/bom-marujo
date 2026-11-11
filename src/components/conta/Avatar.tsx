'use client';

import type { Perfil } from '@/lib/conta/supabase';
import s from './conta.module.css';

/** Foto do perfil, ou a inicial do nome sobre fundo azul claro. */
export function Avatar({ perfil, email, tamanho = 44 }: { perfil: Perfil | null; email?: string; tamanho?: number }) {
  const inicial = (perfil?.nome || email || '?').trim().charAt(0).toUpperCase();
  return (
    <span className={s.avatar} style={{ width: tamanho, height: tamanho, fontSize: tamanho * 0.45 }} aria-hidden>
      {perfil?.foto_url ? (
        // eslint-disable-next-line @next/next/no-img-element -- foto externa (Supabase/Google), sem otimização no export estático
        <img src={perfil.foto_url} alt="" referrerPolicy="no-referrer" />
      ) : (
        inicial
      )}
    </span>
  );
}
