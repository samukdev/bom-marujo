'use client';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { BASE_PATH } from '@/lib/base';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const CHAVE = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/** Sem as variáveis (ex.: build local sem .env.local) o app funciona sem contas. */
export const CONTAS_ATIVAS = Boolean(URL && CHAVE);

let cliente: SupabaseClient | null = null;

/** Cliente único, criado só no navegador (o site é estático: não há servidor nosso). */
export function supabase(): SupabaseClient {
  if (!URL || !CHAVE) throw new Error('Supabase não configurado (NEXT_PUBLIC_SUPABASE_URL / _PUBLISHABLE_KEY).');
  cliente ??= createClient(URL, CHAVE, {
    auth: { flowType: 'pkce', persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
  return cliente;
}

/** Endereço absoluto de uma página do app (para os links de e-mail e o retorno do Google). */
export const urlDoApp = (caminho = '/') => `${window.location.origin}${BASE_PATH}${caminho}`;

export interface Perfil {
  id: string;
  nome: string | null;
  foto_url: string | null;
  criado_em: string;
}
