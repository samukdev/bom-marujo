'use client';

import type { User } from '@supabase/supabase-js';
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { definirUsuario } from '@/lib/progresso';
import { CONTAS_ATIVAS, supabase, type Perfil } from './supabase';

interface Sessao {
  usuario: User | null;
  perfil: Perfil | null;
  /** ainda lendo a sessão salva / trocando o código do link por uma sessão */
  carregando: boolean;
  /** entrou por um link de "esqueci minha senha" */
  recuperandoSenha: boolean;
  recarregarPerfil: () => Promise<void>;
}

const Contexto = createContext<Sessao>({
  usuario: null,
  perfil: null,
  carregando: CONTAS_ATIVAS,
  recuperandoSenha: false,
  recarregarPerfil: async () => {},
});

export const useSessao = () => useContext(Contexto);

export function ProvedorSessao({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [carregando, setCarregando] = useState(CONTAS_ATIVAS);
  const [recuperandoSenha, setRecuperandoSenha] = useState(false);

  const carregarPerfil = useCallback(async (id: string | null) => {
    if (!id) return setPerfil(null);
    const { data } = await supabase().from('perfis').select('id, nome, foto_url, criado_em').eq('id', id).maybeSingle();
    setPerfil(data);
  }, []);

  useEffect(() => {
    if (!CONTAS_ATIVAS) return;
    const { data } = supabase().auth.onAuthStateChange((evento, sessao) => {
      const u = sessao?.user ?? null;
      setUsuario(u);
      setCarregando(false);
      if (evento === 'PASSWORD_RECOVERY') setRecuperandoSenha(true);
      // fora do callback: chamar o Supabase aqui dentro trava o cliente
      setTimeout(() => {
        definirUsuario(u?.id ?? null);
        if (evento !== 'TOKEN_REFRESHED') void carregarPerfil(u?.id ?? null);
      }, 0);
    });
    return () => data.subscription.unsubscribe();
  }, [carregarPerfil]);

  const recarregarPerfil = useCallback(() => carregarPerfil(usuario?.id ?? null), [carregarPerfil, usuario]);

  return <Contexto.Provider value={{ usuario, perfil, carregando, recuperandoSenha, recarregarPerfil }}>{children}</Contexto.Provider>;
}
