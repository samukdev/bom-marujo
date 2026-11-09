import type { NoId } from '@/lib/nos/catalogo';

/** Para que serve cada nó — escrito com nossas palavras; revisar com instrutor. */
export const USOS_NOS: Record<NoId, { uso: string; dica?: string }> = {
  oito: {
    uso: 'Nó de arremate: feito na ponta do cabo para ele não escapar de um moitão, de uma argola ou de um olhal.',
    dica: 'Fácil de desfazer mesmo depois de muito apertado, por isso é preferido ao simples nó de "pescoço".',
  },
  direito: {
    uso: 'Une dois cabos de MESMA bitola (mesma grossura). Também usado para rizar (amarrar) velas.',
    dica: 'Não é seguro para cabos de grossuras diferentes: aí o certo é o nó de escota.',
  },
  escota: {
    uso: 'Une dois cabos de bitolas DIFERENTES. O mais grosso forma o seio (a alça em U); o mais fino passa por ele.',
    dica: 'Com o cabo fino dando duas voltas, vira a escota dobrada, ainda mais firme.',
  },
  'lais-de-guia': {
    uso: 'Faz uma alça fixa na ponta do cabo, que não corre nem aperta. É o nó do salvamento: alça em volta do corpo para içar alguém, ou para passar num cabeço.',
    dica: 'Macete: o coelho sai da toca, dá a volta na árvore e volta para a toca.',
  },
  'volta-do-fiel': {
    uso: 'Prende rapidamente um cabo a um balaústre, mastro ou estaca. É a volta clássica para pendurar a defensa.',
    dica: 'Rápida de dar e de ajustar, mas pode correr se o esforço vier de lados alternados: confira sempre.',
  },
  'volta-de-cunho': {
    uso: 'Amarra o cabo no cunho do cais ou da embarcação: uma volta redonda, cotes em "oito" e um cote mordido para travar.',
    dica: 'Comece sempre pela orelha mais distante de onde vem a força.',
  },
};
