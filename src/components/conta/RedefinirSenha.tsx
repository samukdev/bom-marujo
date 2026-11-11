'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { mensagemDeErro } from '@/lib/conta/erros';
import { useSessao } from '@/lib/conta/sessao';
import { supabase } from '@/lib/conta/supabase';
import { Moldura } from './Moldura';
import s from './conta.module.css';

/** Destino do link de "esqueci minha senha": o cliente troca o código do link por uma sessão e aqui a senha é trocada. */
export function RedefinirSenha() {
  const router = useRouter();
  const { usuario, carregando } = useSessao();
  const [senha, setSenha] = useState('');
  const [repetida, setRepetida] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function salvar(e: FormEvent) {
    e.preventDefault();
    if (senha !== repetida) return setErro('As duas senhas não são iguais.');
    setErro('');
    setEnviando(true);
    const { error } = await supabase().auth.updateUser({ password: senha });
    setEnviando(false);
    if (error) setErro(mensagemDeErro(error));
    else router.replace('/perfil/?senha=nova');
  }

  if (carregando) return <Moldura titulo="Abrindo o link…" pose="pensando">{null}</Moldura>;

  if (!usuario)
    return (
      <Moldura titulo="Link inválido ou vencido" pose="cetico">
        <div className={s.cartao}>
          <p className={`${s.aviso} ${s.erro}`}>
            O link pode ter expirado, já ter sido usado ou ter sido aberto em outro navegador. Peça outro e abra no mesmo navegador em que pediu.
          </p>
          <Link href="/esqueci-senha" className={s.botao}>Pedir novo link</Link>
        </div>
      </Moldura>
    );

  return (
    <Moldura titulo="Nova senha" texto={`Conta ${usuario.email}`}>
      <form className={s.cartao} onSubmit={salvar}>
        <label className={s.campo}>
          Nova senha (mínimo 6 caracteres)
          <input type="password" autoComplete="new-password" required minLength={6} value={senha} onChange={(e) => setSenha(e.target.value)} />
        </label>
        <label className={s.campo}>
          Repita a nova senha
          <input type="password" autoComplete="new-password" required minLength={6} value={repetida} onChange={(e) => setRepetida(e.target.value)} />
        </label>
        {erro && <p className={`${s.aviso} ${s.erro}`} role="alert">{erro}</p>}
        <button className={s.botao} disabled={enviando}>{enviando ? 'Salvando…' : 'Salvar senha'}</button>
      </form>
    </Moldura>
  );
}
