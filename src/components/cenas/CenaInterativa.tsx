'use client';

import { useEffect, useRef, useState } from 'react';
import type { CenaSpec } from '@/content/tipos';
import { SINAIS, type SinalId } from '@/lib/ripeam/sinais';
import { tocarSinal, type Reproducao } from '@/lib/audio/apito';
import { Cena, type EstadoApito } from './Cena';
import s from './cenas.module.css';

/**
 * Cena + barra de controles (fora do SVG, abaixo da moldura): "↻ Ver de novo" para qualquer revelação animada,
 * "🔊 Ouvir" e "🐢" quando há sinal sonoro. Cancela o som ao trocar de cena ou desmontar.
 */
export function CenaInterativa({ spec, revelado = false, som }: { spec: CenaSpec; revelado?: boolean; som?: SinalId }) {
  const [vez, setVez] = useState(0);
  const [apito, setApito] = useState<EstadoApito>({ n: 0, dur: 1 });
  const [tocando, setTocando] = useState(false);
  const [aviso, setAviso] = useState('');
  const repro = useRef<Reproducao | null>(null);
  const seq = useRef(0); // contador monotônico: cada apito remonta a fumaça, mesmo ouvindo de novo

  useEffect(() => () => repro.current?.cancelar(), []);

  const ouvir = (lento = false) => {
    if (!som || tocando) return;
    setTocando(true);
    const r = tocarSinal(SINAIS[som].sinal, {
      lento,
      aoApitar: (i, dur) => {
        seq.current += 1;
        setApito({ n: seq.current, dur });
        setAviso(dur > 2 ? 'apito longo' : 'apito curto');
      },
    });
    repro.current = r;
    void r.fim.then(() => { setTocando(false); setAviso(''); });
  };

  // revelação animada: nós sempre; demais cenas depois da resposta
  const temReplay = spec.tipo === 'no' ? !(spec.oculto && !revelado) : revelado && spec.tipo !== 'bordos';

  return (
    <div className={s.quadro}>
      <div className={s.moldura}>
        <Cena key={vez} spec={spec} revelado={revelado} apito={apito} />
      </div>
      {(temReplay || som) && (
        <div className={s.controles}>
          <span className={s.aviso} aria-live="polite">{aviso}</span>
          {som && (
            <>
              <button type="button" className={`${s.pilula} ${s.pilulaForte}`} onClick={() => ouvir()} disabled={tocando}>🔊 Ouvir</button>
              <button type="button" className={s.pilula} onClick={() => ouvir(true)} disabled={tocando} aria-label="Ouvir devagar (intervalo maior; o apito curto continua com 1 s)">🐢</button>
            </>
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
