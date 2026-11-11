'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState, useSyncExternalStore, type ChangeEvent, type FormEvent } from 'react';
import { mensagemDeErro } from '@/lib/conta/erros';
import { prepararFoto } from '@/lib/conta/foto';
import { useSessao } from '@/lib/conta/sessao';
import { supabase } from '@/lib/conta/supabase';
import { useProgresso } from '@/lib/progresso';
import { Avatar } from './Avatar';
import { Moldura } from './Moldura';
import s from './conta.module.css';

const nada = () => () => {};

type Aviso = { tipo: 'ok' | 'erro'; texto: string } | null;

export function Perfil() {
  const router = useRouter();
  const { usuario, perfil, carregando, recarregarPerfil } = useSessao();
  const { xp, concluidas, historico } = useProgresso();
  const [nome, setNome] = useState<string | null>(null);
  const [aviso, setAviso] = useState<Aviso>(null);
  const [ocupado, setOcupado] = useState<'foto' | 'nome' | 'excluir' | null>(null);
  const [excluindo, setExcluindo] = useState(false);
  const [confirmacao, setConfirmacao] = useState('');
  const arquivo = useRef<HTMLInputElement>(null);

  // veio da tela de nova senha (?senha=nova)
  const senhaNova = useSyncExternalStore(nada, () => new URLSearchParams(window.location.search).has('senha'), () => false);

  if (carregando) return <Moldura titulo="Carregando…" pose="pensando">{null}</Moldura>;
  if (!usuario)
    return (
      <Moldura titulo="Você não entrou" texto="Entre para ter perfil, foto e progresso salvo na conta." pose="cetico">
        <div className={s.cartao}>
          <Link href="/entrar" className={s.botao}>Entrar</Link>
          <Link href="/cadastro" className={`${s.botao} ${s.secundario}`}>Criar conta</Link>
        </div>
      </Moldura>
    );

  const uid = usuario.id;
  const temSenha = usuario.identities?.some((i) => i.provider === 'email');
  const nomeAtual = nome ?? perfil?.nome ?? '';

  async function trocarFoto(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    setOcupado('foto');
    setAviso(null);
    try {
      const blob = await prepararFoto(f);
      const ext = blob.type === 'image/webp' ? 'webp' : 'jpg';
      const sb = supabase();
      const caminho = `${uid}/foto.${ext}`;
      const { error } = await sb.storage.from('avatars').upload(caminho, blob, { upsert: true, contentType: blob.type, cacheControl: '3600' });
      if (error) throw error;
      // remove a foto no outro formato, se houver
      await sb.storage.from('avatars').remove([`${uid}/foto.${ext === 'webp' ? 'jpg' : 'webp'}`]);
      const url = `${sb.storage.from('avatars').getPublicUrl(caminho).data.publicUrl}?v=${Date.now()}`;
      const { error: e2 } = await sb.from('perfis').update({ foto_url: url }).eq('id', uid);
      if (e2) throw e2;
      await recarregarPerfil();
      setAviso({ tipo: 'ok', texto: 'Foto nova no convés!' });
    } catch (err) {
      setAviso({ tipo: 'erro', texto: mensagemDeErro(err) });
    } finally {
      setOcupado(null);
    }
  }

  async function salvarNome(e: FormEvent) {
    e.preventDefault();
    setOcupado('nome');
    const { error } = await supabase().from('perfis').update({ nome: nomeAtual.trim() || null }).eq('id', uid);
    setOcupado(null);
    if (error) return setAviso({ tipo: 'erro', texto: mensagemDeErro(error) });
    await recarregarPerfil();
    setNome(null);
    setAviso({ tipo: 'ok', texto: 'Nome salvo.' });
  }

  async function sair() {
    await supabase().auth.signOut();
    router.replace('/');
  }

  async function exportar() {
    const sb = supabase();
    const [{ data: p }, { data: c }] = await Promise.all([
      sb.from('perfis').select('*').eq('id', uid).maybeSingle(),
      sb.from('conclusoes').select('licao_id, xp, acertos, total, em').order('em'),
    ]);
    const dados = {
      exportado_em: new Date().toISOString(),
      conta: { id: uid, email: usuario?.email, criada_em: usuario?.created_at, entrou_com: usuario?.identities?.map((i) => i.provider) },
      perfil: p,
      licoes_concluidas: c ?? historico,
    };
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' }));
    link.download = 'bom-marujo-meus-dados.json';
    link.click();
    URL.revokeObjectURL(link.href);
  }

  async function excluirConta() {
    setOcupado('excluir');
    const sb = supabase();
    const { data: fotos } = await sb.storage.from('avatars').list(uid);
    if (fotos?.length) await sb.storage.from('avatars').remove(fotos.map((f) => `${uid}/${f.name}`));
    const { error } = await sb.rpc('excluir_minha_conta');
    if (error) {
      setOcupado(null);
      return setAviso({ tipo: 'erro', texto: mensagemDeErro(error) });
    }
    await sb.auth.signOut({ scope: 'local' });
    router.replace('/');
  }

  return (
    <main className={s.app}>
      <Link href="/" className={s.voltar}>← Trilha</Link>

      <section className={s.cartao} style={{ marginTop: 12 }}>
        <div className={s.cabecalho}>
          <button type="button" className={s.trocarFoto} onClick={() => arquivo.current?.click()} disabled={ocupado === 'foto'} aria-label="Trocar foto">
            <Avatar perfil={perfil} email={usuario.email} tamanho={84} />
            <span aria-hidden>{ocupado === 'foto' ? '…' : '📷'}</span>
          </button>
          <input ref={arquivo} type="file" accept="image/*" hidden onChange={trocarFoto} />
          <div>
            <h1>{perfil?.nome || 'Marujo sem nome'}</h1>
            <p>{usuario.email}</p>
          </div>
        </div>
        {!aviso && senhaNova && <p className={`${s.aviso} ${s.ok}`} role="status">Senha trocada. Pode seguir estudando!</p>}
        {aviso && <p className={`${s.aviso} ${s[aviso.tipo]}`} role="status">{aviso.texto}</p>}
        <div className={s.numeros}>
          <div className={s.numero}><b>⭐ {xp}</b><small>XP</small></div>
          <div className={s.numero}><b>{Object.keys(concluidas).length}</b><small>lições concluídas</small></div>
        </div>
      </section>

      <form className={s.cartao} onSubmit={salvarNome}>
        <h2>Seu nome</h2>
        <div className={s.linha}>
          <label className={s.campo}>
            Como o Marujo te chama
            <input maxLength={60} value={nomeAtual} onChange={(e) => setNome(e.target.value)} />
          </label>
          <button className={s.botao} disabled={ocupado === 'nome' || nome === null}>Salvar</button>
        </div>
      </form>

      <section className={s.cartao}>
        <h2>Conta</h2>
        {temSenha && <Link href="/esqueci-senha" className={`${s.botao} ${s.secundario}`}>Trocar senha</Link>}
        <button type="button" className={`${s.botao} ${s.secundario}`} onClick={exportar}>Baixar meus dados</button>
        <button type="button" className={`${s.botao} ${s.secundario}`} onClick={sair}>Sair</button>
      </section>

      <section className={s.cartao}>
        <h2>Excluir conta</h2>
        {!excluindo ? (
          <>
            <p className={s.miudo}>Apaga a conta, a foto e todo o progresso salvo. Não dá para desfazer.</p>
            <button type="button" className={`${s.botao} ${s.perigo}`} onClick={() => setExcluindo(true)}>Excluir minha conta</button>
          </>
        ) : (
          <>
            <label className={s.campo}>
              Para confirmar, digite EXCLUIR
              <input value={confirmacao} onChange={(e) => setConfirmacao(e.target.value)} autoComplete="off" />
            </label>
            <button
              type="button"
              className={`${s.botao} ${s.perigo}`}
              disabled={confirmacao.trim().toUpperCase() !== 'EXCLUIR' || ocupado === 'excluir'}
              onClick={excluirConta}
            >
              {ocupado === 'excluir' ? 'Excluindo…' : 'Excluir para sempre'}
            </button>
            <button type="button" className={s.link} onClick={() => setExcluindo(false)}>Cancelar</button>
          </>
        )}
      </section>
    </main>
  );
}
