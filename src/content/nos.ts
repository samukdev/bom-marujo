import type { NoId } from '@/lib/nos/catalogo';

/**
 * Para que serve cada nó — escrito com nossas palavras; revisar com instrutor.
 * `situacoes`: momentos reais a bordo em que o nó é a escolha certa.
 */
export const USOS_NOS: Record<NoId, { uso: string; dica?: string; situacoes: string[] }> = {
  oito: {
    uso: 'Nó de arremate: feito na ponta do cabo para ele não escapar de um moitão, de uma argola ou de um olhal.',
    dica: 'Fácil de desfazer mesmo depois de muito apertado, por isso é preferido ao nó simples.',
    situacoes: [
      'Arrematar o chicote da escota para ela não escapar pelo moitão quando a vela folga.',
      'Na ponta da adriça, para ela não sumir dentro do mastro se escapar da mão.',
      'No chicote da retinida da boia circular, para dar pega e não escapar da mão (melhor ainda: chicote preso a bordo).',
    ],
  },
  direito: {
    uso: 'Une dois cabos de MESMA bitola (mesma grossura). Também usado para rizar (amarrar) velas.',
    dica: 'Bom para rizes e emendas leves. Sob muito esforço, ou com bitolas diferentes, use o nó de escota.',
    situacoes: [
      'Rizar a vela: amarrar o pano em volta da retranca com os dois chicotes do mesmo cabinho.',
      'Amarrar as gaxetas que prendem a vela ferrada na retranca.',
      'Fechar a trouxa da vela arriada no convés.',
    ],
  },
  escota: {
    uso: 'Une dois cabos de bitolas DIFERENTES. O mais grosso forma o seio (a alça em U); o mais fino passa por ele.',
    dica: 'Com o cabo fino dando duas voltas, vira a escota dobrada, ainda mais firme.',
    situacoes: [
      'Emendar o cabo de reboque grosso da lancha ao cabo fino de um caiaque ou bote.',
      'Emendar a retinida (cabo fino) à alça do cabo de amarração grosso, para passá-lo ao cais.',
      'Aumentar um cabo curto com outro de grossura diferente que estava a bordo.',
    ],
  },
  'lais-de-guia': {
    uso: 'Faz uma alça fixa na ponta do cabo, que não corre nem aperta. É o nó do salvamento: alça em volta do corpo para içar alguém, ou para passar num cabeço.',
    dica: 'Macete: o coelho sai da toca, dá a volta na árvore e volta para a toca.',
    situacoes: [
      'Fazer uma alça para jogar no cabeço do cais ao atracar.',
      'Passar em volta do peito de quem caiu na água para içar a pessoa a bordo.',
      'Prender o cabo de reboque no olhal de proa da outra embarcação: passe o chicote pelo olhal e dê o lais de guia.',
      'Prender a escota no olhal do punho da vela.',
    ],
  },
  'volta-do-fiel': {
    uso: 'Prende rapidamente um cabo a um balaústre, mastro ou estaca. É a volta clássica para pendurar a defensa.',
    dica: 'Rápida de dar e de ajustar, mas pode correr se o esforço vier de lados alternados: confira sempre.',
    situacoes: [
      'Pendurar e ajustar a altura das defensas no balaústre antes de encostar.',
      'Prender por pouco tempo o cabo a uma estaca do píer, com alguém de olho; para ficar, arremate com cotes.',
      'Começar outras amarrações, como a de uma lona num tubo.',
    ],
  },
  'volta-de-cunho': {
    uso: 'Amarra o cabo no cunho do cais ou da embarcação: uma volta redonda, voltas cruzadas em "oito" e um cote mordido para travar.',
    dica: 'Comece sempre pela orelha mais distante de onde vem a força.',
    situacoes: [
      'Amarrar o cabo de proa ou de popa no cunho do píer ao atracar.',
      'Fixar a adriça no cunho do mastro depois de içar a vela.',
      'Amarrar a lancha ao cunho de outra embarcação a contrabordo.',
    ],
  },
};
