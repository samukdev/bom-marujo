/** Tokens do padrão visual das cenas — ver docs/padrao-visual.md. Nenhuma cor avulsa fora daqui. */
export const COR = {
  tinta: '#0B1F3F',
  tintaNoite: '#3A5A8F',
  papel: '#F5F1E6',
  marDia: '#2A7FD0',
  marDiaFundo: '#1557A8',
  ceuDia: '#BFE2FA',
  ceuNoite: '#0B1A36',
  marNoite: '#0C2348',
  cascoNoite: '#162A4D',
  // cor de OBJETO (pintura) ≠ cor de LUZ
  vermelho: '#D4342B',
  verde: '#1F8A4C',
  luzVermelha: '#FF3B30',
  luzVerde: '#22E07A',
  luzBranca: '#FFFFFF',
  luzAmarela: '#FFD23F',
  casco: '#FFFFFF',
  metal: '#C9D2DE',
  vidro: '#9CCBF2',
  azul: '#1765D8',
  fantasma: 'rgba(11,31,63,0.15)',
} as const;

/** Só 3 espessuras de traço. */
export const TRACO = { principal: 3, detalhe: 2, micro: 1.5 } as const;

export const TEMPO = { acao: 2.4, rotulo: 0.3, easing: 'cubic-bezier(.45,0,.3,1)' } as const;
