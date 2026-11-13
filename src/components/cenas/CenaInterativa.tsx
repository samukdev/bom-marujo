'use client';

import { useEffect, useRef, useState } from 'react';
import type { CenaSpec } from '@/content';
import { SINAIS, type SinalId, type SinalSonoro } from '@/lib/ripeam/sinais';
import { tocarSinal, type Reproducao } from '@/lib/audio/apito';
import { Cena, type EstadoApito } from './Cena';
import { renderizador } from './registro';
import s from './cenas.module.css';

const legenda = (sinal: SinalSonoro) => {
  const n = (t: string) => sinal.filter((x) => x === t).length;
  const partes = [n('longo') && `${n('longo')} longo${n('longo') > 1 ? 's' : ''}`, n('curto') && `${n('curto')} curto${n('curto') > 1 ? 's' : ''}`];
  return `Sinal: ${partes.filter(Boolean).join(' e ')}`;
};

/**
 * Cena + barra de controles (fora do SVG, abaixo da moldura). Com sinal sonoro: legenda em código
 * (• curto, — longo; acende o apito que está tocando) e "🔊 Ouvir apito", que toca o som e repassa a cena junto.
 * Sem som: "↻ Ver de novo" para revelações animadas.
 * Cancela o som ao trocar de cena ou desmontar.
 */
export function CenaInterativa({ spec, revelado = false, som }: { spec: CenaSpec; revelado?: boolean; som?: SinalId }) {
  const [vez, setVez] = useState(0);
  const [apito, setApito] = useState<EstadoApito>({ n: 0, dur: 1 });
  const [tocando, setTocando] = useState(false);
  const [atual, setAtual] = useState(-1); // apito tocando agora (-1: nenhum)
  const repro = useRef<Reproducao | null>(null);
  const seq = useRef(0); // contador monotônico: cada apito remonta a fumaça, mesmo ouvindo de novo

  useEffect(() => () => repro.current?.cancelar(), []);

  const ouvir = () => {
    if (!som || tocando) return;
    setTocando(true);
    setApito({ n: 0, dur: 1 });
    setVez((v) => v + 1); // repassa a animação junto com o som
    const r = tocarSinal(SINAIS[som].sinal, {
      aoApitar: (i, dur) => {
        seq.current += 1;
        setApito({ n: seq.current, dur });
        setAtual(i);
      },
    });
    repro.current = r;
    void r.fim.then(() => { setTocando(false); setAtual(-1); });
  };

  const { temReplay: replay } = renderizador(spec);
  const temReplay = !som && (replay ? replay(spec, revelado) : revelado);

  return (
    <div className={s.quadro}>
      <div className={s.moldura}>
        <Cena key={vez} spec={spec} revelado={revelado} apito={apito} />
      </div>
      {(temReplay || som) && (
        <div className={s.controles}>
          {som ? (
            <>
              <span className={s.codigo} aria-label={legenda(SINAIS[som].sinal)}>
                {SINAIS[som].sinal.map((t, i) => (
                  <span key={i} className={`${t === 'curto' ? s.curto : s.longo} ${i === atual ? s.tocando : ''}`} aria-hidden />
                ))}
              </span>
              <button type="button" className={`${s.pilula} ${s.pilulaForte}`} onClick={ouvir} disabled={tocando}>🔊 Ouvir apito</button>
            </>
          ) : (
            <span className={s.aviso} />
          )}
          {temReplay && (
            <button type="button" className={s.pilula} onClick={() => { repro.current?.cancelar(); setApito({ n: 0, dur: 1 }); setVez((v) => v + 1); }}>
              ↻ Ver de novo
            </button>
          )}
        </div>
      )}
    </div>
  );
}
