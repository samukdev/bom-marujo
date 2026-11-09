'use client';
import { asset } from '@/lib/base';

import Image from 'next/image';
import Link from 'next/link';
import { Marujo } from '@/components/marujo/Marujo';
import { LICOES, TEMAS } from '@/content/licoes';
import { useProgresso } from '@/lib/progresso';
import s from './trilha.module.css';

/** Zigue-zague da trilha, no estilo "caminho". */
const DESLOCAMENTO = [0, 56, 84, 56, 0, -56, -84, -56];

export function Trilha() {
  const { concluidas, xp } = useProgresso();
  let n = 0;

  return (
    <div className={s.app}>
      <header className={s.header}>
        <div className={s.logo}>
          <span className={s.avatar} aria-hidden>
            <Image src={asset('/brand/icone-192.png')} alt="" width={192} height={192} priority />
          </span>
          Bom Marujo
        </div>
        <div className={s.xp} title="Experiência">⭐ {xp} XP</div>
      </header>

      <div className={s.boasVindas}>
        <Marujo pose={xp === 0 ? 'continencia' : 'orgulhoso'} altura={150} prioridade />
        <div className={s.balao}>
          {xp === 0 ? (
            <>
              <b>Bem-vindo a bordo, marujo!</b> Sou eu quem vai te preparar pra prova da Marinha. Começa pela primeira lição aí embaixo.
            </>
          ) : (
            <>
              <b>{xp} XP. Nada mal.</b> Mas prova não se passa com meia dúzia de lições. Bora pra próxima!
            </>
          )}
        </div>
      </div>

      {TEMAS.map((tema) => (
        <section key={tema.id} className={s.unidade}>
          <div className={`${s.faixa} ${tema.emBreve ? s.faixaBloq : ''}`}>
            <span className={s.faixaIcone}>{tema.icone}</span>
            <div>
              <small>{tema.emBreve ? 'Em breve' : 'Tema'}</small>
              <b>{tema.titulo}</b>
            </div>
          </div>
          <div className={s.caminho}>
            {(tema.emBreve ? [null, null] : tema.licoes).map((id, k) => {
              const licao = id ? LICOES.find((l) => l.id === id) : undefined;
              const off = DESLOCAMENTO[n++ % DESLOCAMENTO.length];
              const feita = licao && concluidas[licao.id];
              if (!licao)
                return (
                  <div key={k} className={`${s.no} ${s.bloq}`} style={{ translate: `${off}px 0` }} aria-label="Lição bloqueada">🔒</div>
                );
              return (
                <Link
                  key={licao.id}
                  href={`/licao/${licao.id}`}
                  className={`${s.no} ${feita ? s.feita : ''} ${(off ?? 0) > 0 ? s.dicaEsq : ''}`}
                  style={{ translate: `${off}px 0` }}
                  aria-label={`${licao.titulo}${feita ? ' (concluída)' : ''}`}
                >
                  {feita ? '✓' : '★'}
                  <span className={s.dica}>
                    <b>{licao.titulo}</b>
                    {licao.descricao}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      ))}

      <Link href="/nos" className={s.caderno}>🪢 Caderno de nós: veja todos os nós e para que servem</Link>
      <footer className={s.rodape}>Protótipo · conteúdo em revisão técnica</footer>
    </div>
  );
}
