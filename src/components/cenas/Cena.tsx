'use client';

import { useEffect, useId, useState, type CSSProperties } from 'react';
import type { CenaSpec } from '@/content';
import { IdsCena } from './comum';
import { renderizador, type EstadoApito } from './registro';
import s from './cenas.module.css';

export type { EstadoApito };

/**
 * Motor de cenas. Cada cena tem ids próprios (useId) e a revelação sempre ANIMA:
 * ao montar com `revelado`, a cena nasce no estado "antes" e passa para o "depois" no quadro seguinte.
 */
export function Cena({ spec, revelado = false, apito }: { spec: CenaSpec; revelado?: boolean; apito?: EstadoApito }) {
  const ids = useId().replace(/[^a-zA-Z0-9]/g, '');
  const [pronto, setPronto] = useState(false);
  useEffect(() => {
    const r = requestAnimationFrame(() => setPronto(true));
    return () => cancelAnimationFrame(r);
  }, []);
  const rev = revelado && pronto;
  const { Desenho, temAcao } = renderizador(spec);
  return (
    <IdsCena.Provider value={`c${ids}`}>
      <div className={rev ? s.revelado : undefined} style={{ '--atraso-rotulo': temAcao(spec) ? '2.4s' : '0.15s' } as CSSProperties}>
        <Desenho spec={spec} revelado={rev} pedido={revelado} apito={apito} />
      </div>
    </IdsCena.Provider>
  );
}
