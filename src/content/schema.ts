import { z } from 'zod';
import { PORTES, TIPOS_EMBARCACAO } from '@/lib/ripeam/luzes';
import { SINAIS, type SinalId } from '@/lib/ripeam/sinais';
import { SENTIDOS } from '@/lib/iala/boias';
import { NOS, type NoId } from '@/lib/nos/catalogo';
import { POSES, type Pose } from '@/components/marujo/poses';

/*
 * Formato do conteúdo (lições, cartões e cenas). É a fonte única dos tipos: o app, os testes e,
 * na fase 2, o banco usam estes schemas. Um JSON que não passa aqui não chega ao site no ar.
 */

const chaves = <K extends string>(o: Record<K, unknown>) => Object.keys(o) as [K, ...K[]];

const Id = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'id em kebab-case (a-z, 0-9 e hífen)');
const Texto = z.string().trim().min(1);
const SinalIdSchema = z.enum(chaves<SinalId>(SINAIS));
const NoIdSchema = z.enum(chaves<NoId>(NOS));
const PoseSchema = z.enum(chaves<Pose>(POSES));

/* ---------- cenas: o banco guarda só tipo + parâmetros; o desenho é código (components/cenas/registro) ---------- */

export const CenaSchema = z.discriminatedUnion('tipo', [
  z.object({
    tipo: z.literal('luzes-noite'),
    embarcacao: z.object({
      tipo: z.enum(TIPOS_EMBARCACAO),
      porte: z.enum(PORTES).optional(),
      /** com seguimento (movendo-se na água) */
      comSeguimento: z.boolean().optional(),
    }),
    /** marcação do observador a partir da proa da embarcação (0 = de proa, 90 = través BE, 180 = popa) */
    aspecto: z.number().min(0).lt(360),
  }),
  /** `oculto`: antes da resposta as boias aparecem como fantasmas (sem cor nem forma) */
  z.object({ tipo: z.literal('canal'), sentido: z.enum(SENTIDOS), oculto: z.boolean().optional() }),
  /** close das duas marcas laterais (formato e tope) */
  z.object({ tipo: z.literal('marcas'), oculto: z.boolean().optional() }),
  z.object({
    tipo: z.literal('encontro'),
    sinal: SinalIdSchema,
    /** o que o outro navio faz depois que a resposta é revelada */
    manobra: z.enum(['boreste', 'bombordo', 'atras', 'nenhuma']),
    /** a sua lancha também manobra para boreste (roda a roda) */
    vocePara: z.literal('boreste').optional(),
    /** onde está o navio: bem pela proa (roda a roda) ou aberto pela bochecha de boreste */
    posicao: z.enum(['proa', 'boreste']).optional(),
  }),
  z.object({ tipo: z.literal('bordos') }),
  /** nó desenhado; `oculto` mostra um cabo enrolado com "?" até a resposta */
  z.object({ tipo: z.literal('no'), no: NoIdSchema, oculto: z.boolean().optional() }),
]);
export type CenaSpec = z.infer<typeof CenaSchema>;
export type TipoCena = CenaSpec['tipo'];

/* ---------- cartões: cada tipo tem um componente em components/licao/cartoes ---------- */

export const CartaoConceitoSchema = z.object({
  tipo: z.literal('conceito'),
  id: Id,
  titulo: Texto,
  texto: Texto,
  cena: CenaSchema.optional(),
  falaMarujo: Texto.optional(),
  /** pose do Marujo no cartão (padrão: ensinando) */
  pose: PoseSchema.optional(),
});

export const CartaoMultiplaEscolhaSchema = z.object({
  tipo: z.literal('multipla-escolha'),
  id: Id,
  enunciado: Texto,
  /** opcional: questões de teoria (salvatagem, regras) aparecem com o Marujo no lugar da cena */
  cena: CenaSchema.optional(),
  /** se presente, mostra 🔊/🐢 com este sinal */
  som: SinalIdSchema.optional(),
  opcoes: z.array(Texto).min(2).max(4),
  /** índice da alternativa correta (as alternativas são embaralhadas na lição) */
  correta: z.number().int().min(0),
  explicacao: Texto,
  referencia: Texto,
});

export const CartaoSchema = z
  .discriminatedUnion('tipo', [CartaoConceitoSchema, CartaoMultiplaEscolhaSchema])
  .superRefine((c, ctx) => {
    if (c.tipo !== 'multipla-escolha') return;
    if (c.correta >= c.opcoes.length) ctx.addIssue({ code: 'custom', path: ['correta'], message: `correta=${c.correta}, mas só há ${c.opcoes.length} alternativas` });
    if (new Set(c.opcoes).size !== c.opcoes.length) ctx.addIssue({ code: 'custom', path: ['opcoes'], message: 'alternativas repetidas' });
  });
export type Cartao = z.infer<typeof CartaoSchema>;
export type TipoCartao = Cartao['tipo'];
export type CartaoDe<T extends TipoCartao> = Extract<Cartao, { tipo: T }>;

/* ---------- lições e temas ---------- */

export const LicaoSchema = z.object({
  id: Id,
  temaId: Id,
  titulo: Texto,
  descricao: Texto,
  cartoes: z.array(CartaoSchema).min(1),
});
export type Licao = z.infer<typeof LicaoSchema>;

export const TemaSchema = z.object({
  id: Id,
  titulo: Texto,
  icone: Texto,
  /** ids das lições, na ordem da trilha */
  licoes: z.array(Id),
  emBreve: z.boolean().optional(),
});
export type Tema = z.infer<typeof TemaSchema>;

const repetidos = (ids: string[]) => ids.filter((id, i) => ids.indexOf(id) !== i);

export const ConteudoSchema = z
  .object({ temas: z.array(TemaSchema), licoes: z.array(LicaoSchema) })
  .superRefine(({ temas, licoes }, ctx) => {
    const erro = (path: (string | number)[], message: string) => ctx.addIssue({ code: 'custom', path, message });
    for (const id of repetidos(temas.map((t) => t.id))) erro(['temas'], `tema repetido: ${id}`);
    for (const id of repetidos(licoes.map((l) => l.id))) erro(['licoes'], `lição repetida: ${id}`);
    // ids de cartão são únicos no conteúdo todo (o progresso e as respostas apontam para eles)
    for (const id of repetidos(licoes.flatMap((l) => l.cartoes.map((c) => c.id)))) erro(['licoes'], `cartão repetido: ${id}`);
    const idsTema = new Set(temas.map((t) => t.id));
    const idsLicao = new Set(licoes.map((l) => l.id));
    licoes.forEach((l, i) => {
      if (!idsTema.has(l.temaId)) erro(['licoes', i, 'temaId'], `tema inexistente: ${l.temaId}`);
      if (!temas.some((t) => t.id === l.temaId && t.licoes.includes(l.id))) erro(['licoes', i], `lição ${l.id} fora da trilha do tema ${l.temaId}`);
    });
    temas.forEach((t, i) =>
      t.licoes.forEach((id, j) => {
        if (!idsLicao.has(id)) erro(['temas', i, 'licoes', j], `lição inexistente: ${id}`);
      }),
    );
  });
export type Conteudo = z.infer<typeof ConteudoSchema>;
