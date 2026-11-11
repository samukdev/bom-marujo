import dados from './conteudo.json';
import { ConteudoSchema, type Licao } from './schema';

export * from './schema';

/**
 * Conteúdo validado na carga: um JSON inválido quebra o build (e os testes), nunca o site no ar.
 * A origem é o Supabase (rpc `conteudo`): o CI baixa para conteudo.json antes do build
 * (`npm run conteudo`); o arquivo no repositório é a cópia usada no desenvolvimento.
 */
export const CONTEUDO = ConteudoSchema.parse(dados);
export const { temas: TEMAS, licoes: LICOES } = CONTEUDO;

export function getLicao(id: string): Licao | undefined {
  return LICOES.find((l) => l.id === id);
}
