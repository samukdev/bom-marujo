import type { CenaSpec } from '@/content/tipos';
import { CenaBordos } from './CenaBordos';
import { CenaCanal } from './CenaCanal';
import { CenaEncontro } from './CenaEncontro';
import { CenaLuzesNoite } from './CenaLuzesNoite';
import s from './cenas.module.css';

/** Motor de cenas: recebe uma especificação declarativa e desenha a cena correspondente. */
export function Cena({ spec, revelado = false, apitos = 0 }: { spec: CenaSpec; revelado?: boolean; apitos?: number }) {
  return (
    <div className={revelado ? s.revelado : undefined}>
      {spec.tipo === 'luzes-noite' && <CenaLuzesNoite embarcacao={spec.embarcacao} aspecto={spec.aspecto} />}
      {spec.tipo === 'canal' && <CenaCanal sentido={spec.sentido} />}
      {spec.tipo === 'encontro' && (
        <CenaEncontro sinal={spec.sinal} manobra={spec.manobra} vocePara={spec.vocePara} revelado={revelado} apitos={apitos} />
      )}
      {spec.tipo === 'bordos' && <CenaBordos />}
    </div>
  );
}
