'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { mensagemDeErro } from '@/lib/conta/erros';
import { supabase, urlDoApp } from '@/lib/conta/supabase';
import { Moldura } from './Moldura';
import s from './conta.module.css';

export function EsqueciSenha() {
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  async function enviar(e: FormEvent) {
    e.preventDefault();
    setErro('');
    setEnviando(true);
    const { error } = await supabase().auth.resetPasswordForEmail(email.trim(), { redirectTo: urlDoApp('/redefinir-senha/') });
    setEnviando(false);
    if (error) setErro(mensagemDeErro(error));
    else setEnviado(true);
  }

  return (
    <Moldura titulo="Esqueceu a senha?" texto="Acontece até com o comandante. Mandamos um link para você criar outra." pose="pensando">
      <form className={s.cartao} onSubmit={enviar}>
        {enviado ? (
          <>
            <p className={`${s.aviso} ${s.ok}`}>
              Se existir uma conta com <b>{email.trim()}</b>, o link já está a caminho. Abra o e-mail <b>neste mesmo navegador</b>.
            </p>
            <p className={s.miudo}>Não chegou? Olhe a pasta de spam. Entrou com o Google? Então use o botão do Google, sem senha.</p>
          </>
        ) : (
          <>
            <label className={s.campo}>
              E-mail da conta
              <input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            {erro && <p className={`${s.aviso} ${s.erro}`} role="alert">{erro}</p>}
            <button className={s.botao} disabled={enviando}>{enviando ? 'Enviando…' : 'Mandar link'}</button>
          </>
        )}
        <p className={`${s.miudo} ${s.centro}`}>
          <Link href="/entrar" className={s.link}>Voltar para entrar</Link>
        </p>
      </form>
    </Moldura>
  );
}
