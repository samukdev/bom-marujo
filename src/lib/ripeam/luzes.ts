/**
 * Luzes de navegação (RIPEAM Parte C — Regras 20 a 31).
 *
 * Convenção de ângulos:
 *  - `aspecto` = marcação do OBSERVADOR medida a partir da proa da embarcação,
 *    no sentido horário (0° = observador bem pela proa, 90° = pelo través de boreste,
 *    180° = pela popa, 270° = pelo través de bombordo).
 *  - Coordenadas locais da embarcação: `f` (para vante, +proa) e `s` (para boreste, +boreste).
 */

export type CorLuz = 'branca' | 'vermelha' | 'verde' | 'amarela';

export type TipoEmbarcacao =
  | 'propulsao-mecanica'
  | 'vela'
  | 'fundeada'
  | 'sem-governo'
  | 'pesca-arrasto';

export type Porte = 'menor50' | 'maior50';

export type Setor = 'mastro' | 'boreste' | 'bombordo' | 'alcancado' | 'circular';

export interface LuzDef {
  id: string;
  cor: CorLuz;
  setor: Setor;
  /** posição longitudinal relativa ao comprimento (-0.5 popa … +0.5 proa) */
  f: number;
  /** posição transversal relativa à boca (-0.5 bombordo … +0.5 boreste) */
  s: number;
  /** altura relativa (0 = convés, 1 = topo do mastro mais alto) */
  h: number;
}

export interface EmbarcacaoSpec {
  tipo: TipoEmbarcacao;
  porte?: Porte;
  /** com seguimento (movendo-se na água). Afeta luzes de bordo/alcançado em alguns tipos. */
  comSeguimento?: boolean;
}

/** Arcos de visibilidade (Regra 21), em graus a partir da proa, sentido horário. */
export const SETORES: Record<Setor, [number, number]> = {
  mastro: [-112.5, 112.5], // 225°
  boreste: [0, 112.5], // 112,5°
  bombordo: [-112.5, 0], // 112,5°
  alcancado: [112.5, 247.5], // 135°
  circular: [0, 360],
};

const norm180 = (a: number) => {
  const x = ((a % 360) + 360) % 360;
  return x > 180 ? x - 360 : x;
};

/** A luz do setor `setor` é visível para um observador no `aspecto` dado? */
export function setorVisivel(setor: Setor, aspecto: number): boolean {
  if (setor === 'circular') return true;
  const a = norm180(aspecto);
  if (setor === 'alcancado') return Math.abs(a) >= 112.5;
  const [ini, fim] = SETORES[setor];
  // Bem pela proa (0°) as duas luzes de bordo são vistas ao mesmo tempo.
  return a >= ini && a <= fim;
}

const BORDOS: LuzDef[] = [
  { id: 'bordo-be', cor: 'verde', setor: 'boreste', f: 0.1, s: 0.5, h: 0.25 },
  { id: 'bordo-bb', cor: 'vermelha', setor: 'bombordo', f: 0.1, s: -0.5, h: 0.25 },
];
const ALCANCADO: LuzDef = { id: 'alcancado', cor: 'branca', setor: 'alcancado', f: -0.5, s: 0, h: 0.05 };

/** Todas as luzes que a embarcação EXIBE (independente de quem observa). */
export function luzesExibidas(e: EmbarcacaoSpec): LuzDef[] {
  const porte = e.porte ?? 'menor50';
  const seguimento = e.comSeguimento ?? true;
  switch (e.tipo) {
    case 'propulsao-mecanica': {
      // Regra 23: mastro a vante; ≥50 m também mastro a ré, mais alto. Bordos + alcançado.
      const mastros: LuzDef[] = [{ id: 'mastro-av', cor: 'branca', setor: 'mastro', f: 0.25, s: 0, h: 0.75 }];
      if (porte === 'maior50') mastros.push({ id: 'mastro-ar', cor: 'branca', setor: 'mastro', f: -0.2, s: 0, h: 1 });
      return [...mastros, ...BORDOS, ALCANCADO];
    }
    case 'vela':
      // Regra 25: bordos + alcançado. NÃO exibe luz de mastro.
      return [...BORDOS, ALCANCADO];
    case 'fundeada':
      // Regra 30: <50 m — uma circular branca onde melhor possa ser vista (a vante).
      if (porte === 'maior50')
        return [
          { id: 'fundeio-av', cor: 'branca', setor: 'circular', f: 0.45, s: 0, h: 0.7 },
          { id: 'fundeio-ar', cor: 'branca', setor: 'circular', f: -0.45, s: 0, h: 0.4 },
        ];
      return [{ id: 'fundeio', cor: 'branca', setor: 'circular', f: 0.4, s: 0, h: 0.6 }];
    case 'sem-governo':
      // Regra 27(a): duas circulares vermelhas em linha vertical; com seguimento, também bordos + alcançado.
      return [
        { id: 'sg-sup', cor: 'vermelha', setor: 'circular', f: 0, s: 0, h: 1 },
        { id: 'sg-inf', cor: 'vermelha', setor: 'circular', f: 0, s: 0, h: 0.8 },
        ...(seguimento ? [...BORDOS, ALCANCADO] : []),
      ];
    case 'pesca-arrasto':
      // Regra 26(b): verde sobre branca, circulares; com seguimento, bordos + alcançado.
      return [
        { id: 'arr-sup', cor: 'verde', setor: 'circular', f: 0, s: 0, h: 1 },
        { id: 'arr-inf', cor: 'branca', setor: 'circular', f: 0, s: 0, h: 0.8 },
        ...(seguimento ? [...BORDOS, ALCANCADO] : []),
      ];
  }
}

/** Luzes que o observador VÊ, no aspecto informado. */
export function luzesVisiveis(e: EmbarcacaoSpec, aspecto: number): LuzDef[] {
  return luzesExibidas(e).filter((l) => setorVisivel(l.setor, aspecto));
}

/**
 * Projeta um ponto local (f, s) na tela do observador.
 * Retorna a coordenada X na tela (positivo = à DIREITA de quem observa).
 * Dedução: o observador olha para a embarcação; seu "direita" no referencial (f, s)
 * é r = (sen θ, −cos θ). Bem pela proa (θ = 0), r aponta para bombordo — por isso
 * a luz vermelha aparece à direita de quem observa.
 */
export function projetarX(f: number, s: number, aspecto: number): number {
  const t = (aspecto * Math.PI) / 180;
  return f * Math.sin(t) - s * Math.cos(t);
}
