import type { EmbarcacaoSpec } from '@/lib/ripeam/luzes';
import type { SinalId } from '@/lib/ripeam/sinais';
import type { Sentido } from '@/lib/iala/boias';
import type { Pose } from '@/components/marujo/Marujo';
import type { NoId } from '@/lib/nos/catalogo';

/** Especificação declarativa de uma cena — o motor desenha a partir disto. */
export type CenaSpec =
  | {
      tipo: 'luzes-noite';
      embarcacao: EmbarcacaoSpec;
      /** marcação do observador a partir da proa da embarcação (0 = de proa, 90 = través BE, 180 = popa) */
      aspecto: number;
    }
  /** `oculto`: antes da resposta as boias aparecem como fantasmas (sem cor nem forma) */
  | { tipo: 'canal'; sentido: Sentido; oculto?: boolean }
  /** close das duas marcas laterais (formato e tope) */
  | { tipo: 'marcas'; oculto?: boolean }
  | {
      tipo: 'encontro';
      sinal: SinalId;
      /** o que o outro navio faz depois que a resposta é revelada */
      manobra: 'boreste' | 'bombordo' | 'atras' | 'nenhuma';
      /** a sua lancha também manobra para boreste (roda a roda) */
      vocePara?: 'boreste';
      /** onde está o navio: bem pela proa (roda a roda) ou aberto pela bochecha de boreste */
      posicao?: 'proa' | 'boreste';
    }
  | { tipo: 'bordos' }
  /** nó desenhado; `oculto` mostra um cabo enrolado com "?" até a resposta (para não entregar a resposta) */
  | { tipo: 'no'; no: NoId; oculto?: boolean };

export interface Questao {
  id: string;
  enunciado: string;
  cena: CenaSpec;
  /** se presente, mostra o player 🔊/🐢 com este sinal */
  som?: SinalId;
  opcoes: string[];
  correta: number;
  explicacao: string;
  referencia: string;
}

export interface CartaoConceito {
  id: string;
  titulo: string;
  texto: string;
  cena?: CenaSpec;
  falaMarujo?: string;
  /** pose do Marujo no cartão (padrão: ensinando) */
  pose?: Pose;
}

export interface Licao {
  id: string;
  temaId: string;
  titulo: string;
  descricao: string;
  conceitos: CartaoConceito[];
  questoes: Questao[];
}

export interface Tema {
  id: string;
  titulo: string;
  icone: string;
  licoes: string[];
  emBreve?: boolean;
}
