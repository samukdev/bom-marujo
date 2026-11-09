import { writeFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { geometria, listarCruzamentos } from './geometria';
import { NOS, type NoId } from './catalogo';

/**
 * Relatório de topologia: para cada nó, a sequência de cruzamentos ao longo de cada cabo
 * (código de Gauss: P = passa POR CIMA, B = passa POR BAIXO) e os trechos atrás/embaixo de objetos.
 * Rode com RELATORIO_NOS=/caminho/arquivo.md para gravar o relatório em Markdown.
 */
export function relatorio(id: NoId) {
  const def = NOS[id];
  const geos = def.cabos.map((c) => geometria(c.pontos));
  const cruz = listarCruzamentos(geos);
  const visitas: { cabo: number; s: number; id: number; porCima: boolean; x: number; y: number; dz: number }[] = [];
  cruz.forEach((c, k) => {
    const aCima = c.a.z >= c.b.z;
    const dz = Math.abs(c.a.z - c.b.z);
    visitas.push({ cabo: c.a.cabo, s: c.a.s, id: k, porCima: aCima, x: c.a.x, y: c.a.y, dz });
    visitas.push({ cabo: c.b.cabo, s: c.b.s, id: k, porCima: !aCima, x: c.b.x, y: c.b.y, dz });
  });
  // renumera cruzamentos na ordem em que aparecem percorrendo os cabos
  const ordem = new Map<number, number>();
  const porCabo = def.cabos.map((_, i) =>
    visitas.filter((v) => v.cabo === i).sort((p, q) => p.s - q.s),
  );
  porCabo.flat().forEach((v) => { if (!ordem.has(v.id)) ordem.set(v.id, ordem.size + 1); });
  const gauss = porCabo.map((vs) => vs.map((v) => `${v.porCima ? 'P' : 'B'}${ordem.get(v.id)}`).join(' '));
  const alternado = porCabo.every((vs) => vs.every((v, i) => i === 0 || v.porCima !== vs[i - 1]!.porCima));
  const ambiguos = cruz.filter((c) => Math.abs(c.a.z - c.b.z) < 0.3).length;
  const atras = def.objeto
    ? geos.map((g, i) => {
        const trechos: string[] = [];
        let ini: number | null = null;
        g.amostras.forEach((p, k) => {
          if (p.z < 0 && ini === null) ini = k;
          if ((p.z >= 0 || k === g.amostras.length - 1) && ini !== null) {
            const a = g.amostras[ini]!, b = g.amostras[k]!;
            trechos.push(`(${a.x.toFixed(0)},${a.y.toFixed(0)})→(${b.x.toFixed(0)},${b.y.toFixed(0)})`);
            ini = null;
          }
        });
        return `cabo ${i + 1}: ${trechos.join(', ') || 'nenhum'}`;
      })
    : [];
  const detalhes = porCabo.map((vs, i) =>
    vs.map((v) => `  - cabo ${i + 1}, s=${v.s.toFixed(0)}px, em (${v.x.toFixed(0)},${v.y.toFixed(0)}): ${v.porCima ? 'POR CIMA' : 'por baixo'} no cruzamento ${ordem.get(v.id)} (Δz=${v.dz.toFixed(2)})`).join('\n'),
  );
  return { id, nome: def.nome, cabos: def.cabos.length, cruzamentos: cruz.length, gauss, alternado, ambiguos, atras, detalhes };
}

const IDS = Object.keys(NOS) as NoId[];

/**
 * Writhe do fecho do nó direito (pontas de cima unidas, pontas de baixo unidas): percorre o cabo 1
 * do início ao fim e o cabo 2 ao contrário. Nó direito (trevo # trevo espelhado) → 0; nó torto → ±6.
 */
function writheDireito(): number {
  const geos = NOS.direito.cabos.map((c) => geometria(c.pontos));
  const dir = (cabo: number, s: number) => {
    const am = geos[cabo]!.amostras;
    const i = am.findIndex((p) => p.s >= s);
    const p = am[Math.max(0, i - 1)]!, q = am[Math.min(am.length - 1, i + 1)]!;
    const v = [q.x - p.x, q.y - p.y];
    return cabo === 1 ? [-v[0]!, -v[1]!] : v;
  };
  let w = 0;
  for (const c of listarCruzamentos(geos)) {
    const da = dir(c.a.cabo, c.a.s), db = dir(c.b.cabo, c.b.s);
    const [cima, baixo] = c.a.z >= c.b.z ? [da, db] : [db, da];
    w += Math.sign(-(cima[0]! * baixo[1]! - cima[1]! * baixo[0]!));
  }
  return w;
}

describe('topologia dos nós', () => {
  it('nenhum cruzamento ambíguo (Δz < 0,3)', () => {
    for (const id of IDS) expect(relatorio(id).ambiguos, id).toBe(0);
  });
  it('nó de oito: 4 cruzamentos alternados', () => {
    const r = relatorio('oito');
    expect(r.cruzamentos).toBe(4);
    expect(r.alternado).toBe(true);
  });
  it('nó direito: 6 cruzamentos e writhe do fecho = 0 (o nó torto daria ±6)', () => {
    const r = relatorio('direito');
    expect(r.cruzamentos).toBe(6);
    expect(writheDireito()).toBe(0);
  });

  it('gera relatório (opcional)', () => {
    const destino = process.env.RELATORIO_NOS;
    if (!destino) return;
    const md = IDS.map((id) => {
      const r = relatorio(id);
      return [
        `## ${r.nome} (\`${r.id}\`)`,
        `- cabos: ${r.cabos} · cruzamentos: ${r.cruzamentos} · alternado em todos os cabos: ${r.alternado ? 'sim' : 'não'}`,
        ...r.gauss.map((g, i) => `- código de Gauss, cabo ${i + 1} (do início ao chicote): \`${g || '—'}\``),
        ...(r.atras.length ? ['- trechos atrás/embaixo do objeto (z<0):', ...r.atras.map((a) => `  - ${a}`)] : []),
        '- passagens:',
        ...r.detalhes,
      ].join('\n');
    }).join('\n\n');
    writeFileSync(destino, `# Relatório de topologia dos nós\n\nP = passa POR CIMA · B = passa POR BAIXO. Coordenadas no viewBox 400×260 (y para baixo).\n\n${md}\n`);
  });
});
