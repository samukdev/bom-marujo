import { describe, expect, it } from 'vitest';
import dados from './conteudo.json';
import { CONTEUDO, getLicao } from './index';
import { CenaSchema, ConteudoSchema } from './schema';

/** Cópia mutável do conteúdo real, para estragar um pedaço por teste. */
const copia = () => structuredClone(dados) as unknown as { temas: { id: string; licoes: string[] }[]; licoes: { id: string; temaId: string; cartoes: Record<string, unknown>[] }[] };
const primeiraQuestao = (c: ReturnType<typeof copia>) => c.licoes.flatMap((l) => l.cartoes).find((x) => x.tipo === 'multipla-escolha')!;
const erros = (c: unknown) => {
  const r = ConteudoSchema.safeParse(c);
  return r.success ? [] : r.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`);
};

describe('conteúdo atual', () => {
  it('passa no schema', () => {
    expect(erros(dados)).toEqual([]);
    expect(CONTEUDO.licoes.length).toBeGreaterThan(0);
  });

  it('toda lição do tema existe e tem ao menos uma questão', () => {
    for (const t of CONTEUDO.temas) {
      if (t.emBreve) continue;
      for (const id of t.licoes) {
        const l = getLicao(id);
        expect(l, id).toBeDefined();
        expect(l!.cartoes.some((c) => c.tipo === 'multipla-escolha'), id).toBe(true);
      }
    }
  });

  it('questão com som mostra a cena do encontro com o mesmo sinal', () => {
    for (const c of CONTEUDO.licoes.flatMap((l) => l.cartoes)) {
      if (c.tipo !== 'multipla-escolha' || !c.som) continue;
      expect(c.cena.tipo, c.id).toBe('encontro');
      if (c.cena.tipo === 'encontro') expect(c.cena.sinal, c.id).toBe(c.som);
    }
  });
});

describe('o schema barra conteúdo quebrado', () => {
  it('alternativa correta fora da lista', () => {
    const c = copia();
    primeiraQuestao(c).correta = 9;
    expect(erros(c).join('\n')).toMatch(/correta=9/);
  });

  it('alternativas repetidas', () => {
    const c = copia();
    const q = primeiraQuestao(c);
    q.opcoes = ['A', 'A', 'B'];
    q.correta = 0;
    expect(erros(c).join('\n')).toMatch(/repetidas/);
  });

  it('tipo de cartão desconhecido', () => {
    const c = copia();
    c.licoes[0]!.cartoes[0]!.tipo = 'verdadeiro-falso';
    expect(erros(c).length).toBeGreaterThan(0);
  });

  it('cena com tipo ou parâmetro inválido', () => {
    expect(CenaSchema.safeParse({ tipo: 'tsunami' }).success).toBe(false);
    expect(CenaSchema.safeParse({ tipo: 'no', no: 'nó-de-vovó' }).success).toBe(false);
    expect(CenaSchema.safeParse({ tipo: 'encontro', sinal: 'buzina', manobra: 'nenhuma' }).success).toBe(false);
    expect(CenaSchema.safeParse({ tipo: 'luzes-noite', embarcacao: { tipo: 'vela' }, aspecto: 400 }).success).toBe(false);
    expect(CenaSchema.safeParse({ tipo: 'luzes-noite', embarcacao: { tipo: 'vela' }, aspecto: 90 }).success).toBe(true);
  });

  it('id de cartão repetido entre lições', () => {
    const c = copia();
    c.licoes[1]!.cartoes[0]!.id = c.licoes[0]!.cartoes[0]!.id as string;
    expect(erros(c).join('\n')).toMatch(/cartão repetido/);
  });

  it('lição fora da trilha e tema apontando para lição inexistente', () => {
    const c = copia();
    c.temas[0]!.licoes = ['licao-fantasma'];
    const e = erros(c).join('\n');
    expect(e).toMatch(/lição inexistente: licao-fantasma/);
    expect(e).toMatch(/fora da trilha/);
  });

  it('id fora do padrão kebab-case', () => {
    const c = copia();
    c.licoes[0]!.cartoes[0]!.id = 'Cartão 1';
    expect(erros(c).join('\n')).toMatch(/kebab-case/);
  });
});
