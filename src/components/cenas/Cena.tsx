'use client';

import { useEffect, useId, useState, type CSSProperties } from 'react';
import type { CenaSpec } from '@/content/tipos';
import { CenaBordos } from './CenaBordos';
import { CenaCanal } from './CenaCanal';
import { CenaEncontro } from './CenaEncontro';
import { CenaLuzesNoite } from './CenaLuzesNoite';
import { CenaMarcas } from './CenaMarcas';
import { CenaNo } from './CenaNo';
import { IdsCena } from './comum';
import s from './cenas.module.css';

export interface EstadoApito {
  /** quantos apitos já soaram (muda a cada apito, para reiniciar a fumaça) */
  n: number;
  /** duração do apito atual em s (a fumaça dura o mesmo) */
  dur: number;
}

/**
 * Motor de cenas. Cada cena tem ids próprios (useId) e a revelação sempre ANIMA:
 * ao montar com `revelado`, a cena nasce no estado "antes" e passa para o "depois" no quadro seguinte.
 */
/** Cenas com ação de 2,4 s: os rótulos só entram depois dela. */
function temAcao(spec: CenaSpec) {
  return spec.tipo === 'no' || spec.tipo === 'canal' || spec.tipo === 'marcas' || (spec.tipo === 'encontro' && spec.manobra !== 'nenhuma');
}

export function Cena({ spec, revelado = false, apito }: { spec: CenaSpec; revelado?: boolean; apito?: EstadoApito }) {
  const ids = useId().replace(/[^a-zA-Z0-9]/g, '');
  const [pronto, setPronto] = useState(false);
  useEffect(() => {
    const r = requestAnimationFrame(() => setPronto(true));
    return () => cancelAnimationFrame(r);
  }, []);
  const rev = revelado && pronto;
  return (
    <IdsCena.Provider value={`c${ids}`}>
      <div className={rev ? s.revelado : undefined} style={{ '--atraso-rotulo': temAcao(spec) ? '2.4s' : '0.15s' } as CSSProperties}>
        {spec.tipo === 'luzes-noite' && <CenaLuzesNoite embarcacao={spec.embarcacao} aspecto={spec.aspecto} revelado={rev} />}
        {spec.tipo === 'canal' && <CenaCanal sentido={spec.sentido} oculto={spec.oculto && !rev} />}
        {spec.tipo === 'marcas' && <CenaMarcas oculto={spec.oculto && !rev} />}
        {spec.tipo === 'encontro' && (
          <CenaEncontro sinal={spec.sinal} manobra={spec.manobra} vocePara={spec.vocePara} posicao={spec.posicao} revelado={rev} apito={apito} />
        )}
        {spec.tipo === 'bordos' && <CenaBordos />}
        {spec.tipo === 'no' && <CenaNo no={spec.no} oculto={spec.oculto && !revelado} revelado={rev} />}
      </div>
    </IdsCena.Provider>
  );
}
