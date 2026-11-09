/**
 * Sinais sonoros (RIPEAM Regras 32 a 35).
 * Apito curto ≈ 1 s · apito longo de 4 a 6 s (Regra 32).
 */

export type Toque = 'curto' | 'longo';
export type SinalSonoro = Toque[];

export const DURACAO_S: Record<Toque, number> = { curto: 1, longo: 5 };

export const c: Toque = 'curto';
export const l: Toque = 'longo';

export type SinalId =
  | 'guinando-boreste'
  | 'guinando-bombordo'
  | 'maquinas-atras'
  | 'duvida'
  | 'ultrapassar-boreste'
  | 'ultrapassar-bombordo'
  | 'concordancia'
  | 'curva'
  | 'cerracao-com-seguimento'
  | 'cerracao-sem-seguimento'
  | 'cerracao-restrita';

export interface SinalDef {
  id: SinalId;
  sinal: SinalSonoro;
  significado: string;
  regra: string;
}

export const SINAIS: Record<SinalId, SinalDef> = {
  'guinando-boreste': { id: 'guinando-boreste', sinal: [c], significado: 'Estou guinando para boreste', regra: 'RIPEAM Regra 34(a)' },
  'guinando-bombordo': { id: 'guinando-bombordo', sinal: [c, c], significado: 'Estou guinando para bombordo', regra: 'RIPEAM Regra 34(a)' },
  'maquinas-atras': { id: 'maquinas-atras', sinal: [c, c, c], significado: 'Estou dando máquinas atrás', regra: 'RIPEAM Regra 34(a)' },
  duvida: { id: 'duvida', sinal: [c, c, c, c, c], significado: 'Não entendi suas intenções / dúvida', regra: 'RIPEAM Regra 34(d)' },
  'ultrapassar-boreste': { id: 'ultrapassar-boreste', sinal: [l, l, c], significado: 'Pretendo ultrapassá-lo por seu boreste (canal estreito)', regra: 'RIPEAM Regra 34(c)' },
  'ultrapassar-bombordo': { id: 'ultrapassar-bombordo', sinal: [l, l, c, c], significado: 'Pretendo ultrapassá-lo por seu bombordo (canal estreito)', regra: 'RIPEAM Regra 34(c)' },
  concordancia: { id: 'concordancia', sinal: [l, c, l, c], significado: 'De acordo com a ultrapassagem', regra: 'RIPEAM Regra 34(c)' },
  curva: { id: 'curva', sinal: [l], significado: 'Aproximando-me de curva ou trecho sem visibilidade', regra: 'RIPEAM Regra 34(e)' },
  'cerracao-com-seguimento': { id: 'cerracao-com-seguimento', sinal: [l], significado: 'Visibilidade restrita: propulsão mecânica com seguimento (a cada 2 min)', regra: 'RIPEAM Regra 35(a)' },
  'cerracao-sem-seguimento': { id: 'cerracao-sem-seguimento', sinal: [l, l], significado: 'Visibilidade restrita: propulsão mecânica parada, sem seguimento (a cada 2 min)', regra: 'RIPEAM Regra 35(b)' },
  'cerracao-restrita': { id: 'cerracao-restrita', sinal: [l, c, c], significado: 'Visibilidade restrita: sem governo, manobra restrita, vela, pesca ou rebocando', regra: 'RIPEAM Regra 35(c)' },
};

/** Notação visual: • curto, ▬ longo. */
export function notacao(s: SinalSonoro): string {
  return s.map((t) => (t === 'curto' ? '•' : '▬')).join(' ');
}

export function descrever(s: SinalSonoro): string {
  const curtos = s.filter((t) => t === 'curto').length;
  const longos = s.length - curtos;
  if (longos === 0) return `${curtos} ${curtos === 1 ? 'apito curto' : 'apitos curtos'}`;
  if (curtos === 0) return `${longos} ${longos === 1 ? 'apito longo' : 'apitos longos'}`;
  return s.map((t) => t).join(', ');
}
