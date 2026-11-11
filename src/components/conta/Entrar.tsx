'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import { mensagemDeErro } from '@/lib/conta/erros';
import { useSessao } from '@/lib/conta/sessao';
import { supabase } from '@/lib/conta/supabase';
import { BotaoGoogle } from './BotaoGoogle';
import { Moldura } from './Moldura';
import s from './conta.module.css';

export function Entrar() {
  const router = useRouter();
  const { usuario } = useSessao();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (usuario) router.replace('/');
  }, [usuario, router]);

  async function entrar(e: FormEvent) {
    e.preventDefault();
    setErro('');
    setEnviando(true);
    const { error } = await supabase().auth.signInWithPassword({ email: email.trim(), password: senha });
    setEnviando(false);
    if (error) setErro(mensagemDeErro(error));
  }

  return (
    <Moldura titulo="Entrar a bordo" texto="Seu progresso fica salvo na conta e vai com você para qualquer aparelho.">
      <form className={s.cartao} onSubmit={entrar}>
        <BotaoGoogle onErro={setErro} />
        <div className={s.divisor}>ou com e-mail</div>
        <label className={s.campo}>
          E-mail
          <input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className={s.campo}>
          Senha
          <input type="password" autoComplete="current-password" required value={senha} onChange={(e) => setSenha(e.target.value)} />
        </label>
        {erro && <p className={`${s.aviso} ${s.erro}`} role="alert">{erro}</p>}
        <button className={s.botao} disabled={enviando}>{enviando ? 'Entrando…' : 'Entrar'}</button>
        <div className={s.links}>
          <Link href="/esqueci-senha">Esqueci minha senha</Link>
          <Link href="/cadastro">Criar conta</Link>
        </div>
      </form>
    </Moldura>
  );
}
