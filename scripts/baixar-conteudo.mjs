// Baixa o conteúdo publicado no Supabase para src/content/conteudo.json.
// Roda no CI antes do build (o build valida com o zod e falha se algo estiver errado)
// e localmente com `npm run conteudo` para trazer as edições feitas no painel.
import { writeFile } from 'node:fs/promises';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const chave = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
if (!url || !chave) {
  console.error('Faltam NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (veja .env.local).');
  process.exit(1);
}

const resp = await fetch(`${url}/rest/v1/rpc/conteudo`, {
  method: 'POST',
  headers: { apikey: chave, 'Content-Type': 'application/json' },
  body: '{}',
});
if (!resp.ok) {
  console.error(`Supabase respondeu ${resp.status}: ${await resp.text()}`);
  process.exit(1);
}
const conteudo = await resp.json();
const destino = new URL('../src/content/conteudo.json', import.meta.url);
await writeFile(destino, JSON.stringify(conteudo, null, 2) + '\n');
const cartoes = conteudo.licoes.reduce((n, l) => n + l.cartoes.length, 0);
console.log(`Conteúdo baixado: ${conteudo.temas.length} temas, ${conteudo.licoes.length} lições, ${cartoes} cartões.`);
