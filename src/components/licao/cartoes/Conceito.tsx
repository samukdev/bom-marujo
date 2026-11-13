'use client';

import type { CartaoDe } from '@/content';
import { Cena } from '@/components/cenas/Cena';
import { CenaInterativa } from '@/components/cenas/CenaInterativa';
import { Marujo } from '@/components/marujo/Marujo';
import type { TipoInformativo } from './tipos';
import { estiloRevisao as r } from './revisao';
import s from '../licao.module.css';

type C = CartaoDe<'conceito'>;

export const conceito: TipoInformativo<C> = {
  avaliativo: false,
  rotulo: '✨ Novo conceito',
  Tela: ({ cartao: c, chave }) => (
    <>
      <h1 className={s.titulo}>{c.titulo}</h1>
      {c.cena && (
        <CenaInterativa key={`${c.id}-${chave}`} spec={c.cena} revelado som={c.cena.tipo === 'encontro' ? c.cena.sinal : undefined} />
      )}
      <p className={s.texto}>{c.texto}</p>
      {c.falaMarujo && (
        <div className={s.marujo}>
          <Marujo key={`${c.id}-${chave}`} pose={c.pose ?? 'ensinando'} altura={130} />
          <div className={s.balao}>{c.falaMarujo}</div>
        </div>
      )}
    </>
  ),
  Revisao: ({ cartao: c }) => (
    <>
      <div style={r.selo}>CONCEITO · {c.id}</div>
      <h3 style={r.h3}>{c.titulo}</h3>
      <div style={r.duas}>
        {c.cena && <div style={r.cena}><Cena spec={c.cena} revelado /></div>}
        <div>
          <p style={{ margin: 0, lineHeight: 1.45 }}>{c.texto}</p>
          {c.falaMarujo && (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginTop: 10 }}>
              <Marujo pose={c.pose ?? 'ensinando'} altura={90} animacao="nenhuma" />
              <em>“{c.falaMarujo}”</em>
            </div>
          )}
        </div>
      </div>
    </>
  ),
};
