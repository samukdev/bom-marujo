import type { ReactNode } from 'react';

export interface PropsTela<C, R> {
  cartao: C;
  resposta: R | null;
  responder: (r: R) => void;
  /** a resposta já foi conferida (a cena revela, as alternativas travam) */
  conferido: boolean;
  /** muda a cada vez que o cartão aparece na fila (remonta cenas e animações) */
  chave: string;
}

export interface Avaliacao {
  certo: boolean;
  /** texto da resposta certa, mostrado no rodapé quando o aluno erra */
  respostaCerta: string;
  explicacao: string;
  referencia: string;
}

interface Base<C, R> {
  Tela: (p: PropsTela<C, R>) => ReactNode;
  /** como o cartão aparece na página interna /revisao (cena antes e depois, resposta marcada) */
  Revisao: (p: { cartao: C }) => ReactNode;
}

/** Cartão que só ensina: tem rótulo próprio e o botão é "Continuar". */
export interface TipoInformativo<C> extends Base<C, unknown> {
  avaliativo: false;
  rotulo: string;
}

/** Cartão que pergunta: conta para a nota, erro volta no fim da lição. */
export interface TipoAvaliativo<C, R> extends Base<C, R> {
  avaliativo: true;
  /** prepara o cartão para exibição (ex.: embaralhar alternativas); `sal` muda na repetição */
  preparar: (c: C, sal: string) => C;
  /** atalho de teclado → resposta (ex.: 1–4) */
  respostaPorTecla?: (c: C, tecla: string) => R | undefined;
  avaliar: (c: C, r: R) => Avaliacao;
}

export type TipoDeCartao<C, R = never> = TipoInformativo<C> | TipoAvaliativo<C, R>;
