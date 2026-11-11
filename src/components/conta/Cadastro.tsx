'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import { mensagemDeErro } from '@/lib/conta/erros';
import { useSessao } from '@/lib/conta/sessao';
import { supabase, urlDoApp } from '@/lib/conta/supabase';
import { BotaoGoogle } from './BotaoGoogle';
import { Moldura } from './Moldura';
import s from './conta.module.css';

export function Cadastro() {
  const router = useRouter();
  const { usuario } = useSessao();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [confirmar, setConfirmar] = useState('');

  useEffect(() => {
    if (usuario) router.replace('/');
  }, [usuario, router]);

  async function cadastrar(e: FormEvent) {
    e.preventDefault();
    setErro('');
    setEnviando(true);
    const { data, error } = await supabase().auth.signUp({
      email: email.trim(),
      password: senha,
      options: { data: { nome: nome.trim() }, emailRedirectTo: urlDoApp('/') },
    });
    setEnviando(false);
    if (error) return setErro(mensagemDeErro(error));
    // com confirmação de e-mail ligada, um e-mail já cadastrado volta sem identidades (e sem erro, por segurança)
    if (data.user && data.user.identities?.length === 0) return setErro(mensagemDeErro({ code: 'user_already_exists' }));
    if (!data.session) setConfirmar(email.trim());
  }

  if (confirmar)
    return (
      <Moldura titulo="Confira seu e-mail" pose="apito">
        <div className={s.cartao}>
          <p className={`${s.aviso} ${s.ok}`}>
            Mandamos um link para <b>{confirmar}</b>. Abra o e-mail e toque no link para ativar a conta.
          </p>
          <p className={s.miudo}>Não chegou? Olhe a pasta de spam ou promoções. O link vale por 24 horas.</p>
          <Link href="/entrar" className={`${s.botao} ${s.secundario}`}>Voltar para entrar</Link>
        </div>
      </Moldura>
    );

  return (
    <Moldura titulo="Criar conta" texto="Leva meio minuto. Ou entre com o Google, que é mais rápido ainda.">
      <form className={s.cartao} onSubmit={cadastrar}>
        <BotaoGoogle onErro={setErro} />
        <div className={s.divisor}>ou com e-mail</div>
        <label className={s.campo}>
          Como quer ser chamado?
          <input autoComplete="nickname" required maxLength={60} value={nome} onChange={(e) => setNome(e.target.value)} />
        </label>
        <label className={s.campo}>
          E-mail
          <input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className={s.campo}>
          Senha (mínimo 6 caracteres)
          <input type="password" autoComplete="new-password" required minLength={6} value={senha} onChange={(e) => setSenha(e.target.value)} />
        </label>
        {erro && <p className={`${s.aviso} ${s.erro}`} role="alert">{erro}</p>}
        <button className={s.botao} disabled={enviando}>{enviando ? 'Criando…' : 'Criar conta'}</button>
        <p className={`${s.miudo} ${s.centro}`}>
          Já tem conta? <Link href="/entrar" className={s.link}>Entrar</Link>
        </p>
      </form>
    </Moldura>
  );
}
