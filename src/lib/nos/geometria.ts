/**
 * Geometria de cabos (cordas) para desenhar nós.
 *
 * Cada cabo é uma lista de pontos de controle [x, y, z]. A curva passa pelos pontos
 * (Catmull-Rom centrípeta — não forma bicos nem laçadas falsas), é reamostrada em passos
 * iguais e suavizada, para não sobrar canto vivo. `z` é a "altura": em cada cruzamento, o
 * trecho com z MAIOR passa POR CIMA. Com um objeto (cunho, balaústre), z < 0 fica atrás dele.
 */

export type Ponto = [x: number, y: number, z: number];

export interface Amostra {
  x: number;
  y: number;
  z: number;
  s: number; // comprimento de arco acumulado
}

export interface CaboGeo {
  amostras: Amostra[];
  comprimento: number;
}

export interface Trecho {
  cabo: number;
  ini: number; // comprimento de arco
  fim: number;
  z: number;
}

const PASSO = 2.5; // px entre amostras
const SUAVIZACAO = 36; // iterações de suavização (≈ raio mínimo de curva de ~15 px)

type V = [number, number, number];

/** Catmull-Rom centrípeta (alpha = 0,5) entre p1 e p2. */
function catmullRom(p0: V, p1: V, p2: V, p3: V, n: number): V[] {
  const dist = (a: V, b: V) => Math.max(Math.hypot(b[0] - a[0], b[1] - a[1]) ** 0.5, 1e-4);
  const t0 = 0;
  const t1 = t0 + dist(p0, p1);
  const t2 = t1 + dist(p1, p2);
  const t3 = t2 + dist(p2, p3);
  const lerp = (a: V, b: V, ta: number, tb: number, t: number): V =>
    [0, 1, 2].map((k) => ((tb - t) / (tb - ta)) * a[k]! + ((t - ta) / (tb - ta)) * b[k]!) as V;
  const out: V[] = [];
  for (let i = 1; i <= n; i++) {
    const t = t1 + ((t2 - t1) * i) / n;
    const a1 = lerp(p0, p1, t0, t1, t);
    const a2 = lerp(p1, p2, t1, t2, t);
    const a3 = lerp(p2, p3, t2, t3, t);
    const b1 = lerp(a1, a2, t0, t2, t);
    const b2 = lerp(a2, a3, t1, t3, t);
    out.push(lerp(b1, b2, t1, t2, t));
  }
  return out;
}

function reamostrar(pts: V[], passo: number): V[] {
  const out: V[] = [pts[0]!];
  let resto = 0;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1]!, b = pts[i]!;
    const seg = Math.hypot(b[0] - a[0], b[1] - a[1]);
    let d = passo - resto;
    while (d <= seg) {
      const t = d / seg;
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]);
      d += passo;
    }
    resto = seg - (d - passo);
  }
  out.push(pts[pts.length - 1]!);
  return out;
}

export function geometria(pontos: Ponto[]): CaboGeo {
  const n = pontos.length;
  const P = (i: number): V => {
    if (i < 0) return [2 * pontos[0]![0] - pontos[1]![0], 2 * pontos[0]![1] - pontos[1]![1], pontos[0]![2]];
    if (i >= n) {
      const a = pontos[n - 1]!, b = pontos[n - 2]!;
      return [2 * a[0] - b[0], 2 * a[1] - b[1], a[2]];
    }
    return pontos[i]!;
  };
  let pts: V[] = [P(0)];
  for (let i = 0; i < n - 1; i++) pts.push(...catmullRom(P(i - 1), P(i), P(i + 1), P(i + 2), 24));
  pts = reamostrar(pts, PASSO);

  // suavização (pontas fixas): remove os cantos vivos que sobram entre pontos de controle próximos
  for (let it = 0; it < SUAVIZACAO; it++) {
    const novo = pts.map((p) => [...p] as V);
    for (let i = 1; i < pts.length - 1; i++) {
      for (let k = 0; k < 3; k++) novo[i]![k] = 0.25 * pts[i - 1]![k]! + 0.5 * pts[i]![k]! + 0.25 * pts[i + 1]![k]!;
    }
    pts = novo;
  }

  let s = 0;
  const amostras: Amostra[] = pts.map((p, i) => {
    if (i > 0) s += Math.hypot(p[0] - pts[i - 1]![0], p[1] - pts[i - 1]![1]);
    return { x: p[0], y: p[1], z: p[2], s };
  });
  return { amostras, comprimento: s };
}

/** Pedaço [ini, fim] da curva (com pontas interpoladas). */
export function recorte(a: Amostra[], ini = 0, fim = Infinity): Amostra[] {
  const out: Amostra[] = [];
  const interp = (p: Amostra, q: Amostra, s: number): Amostra => {
    const t = (s - p.s) / Math.max(q.s - p.s, 1e-9);
    return { x: p.x + (q.x - p.x) * t, y: p.y + (q.y - p.y) * t, z: p.z + (q.z - p.z) * t, s };
  };
  for (let i = 0; i < a.length; i++) {
    const p = a[i]!;
    if (p.s < ini) {
      const q = a[i + 1];
      if (q && q.s > ini) out.push(interp(p, q, ini));
      continue;
    }
    if (p.s > fim) {
      const ant = a[i - 1];
      if (ant && ant.s < fim) out.push(interp(ant, p, fim));
      break;
    }
    out.push(p);
  }
  return out;
}

export function caminho(a: Amostra[]): string {
  return a.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join('');
}

function normal(a: Amostra[], i: number): [number, number] {
  const p = a[Math.max(0, i - 1)]!, q = a[Math.min(a.length - 1, i + 1)]!;
  const dx = q.x - p.x, dy = q.y - p.y;
  const L = Math.hypot(dx, dy) || 1;
  return [-dy / L, dx / L];
}

/** Linha paralela à curva, deslocada `d` px para um lado. */
export function deslocar(a: Amostra[], d: number): string {
  return a
    .map((p, i) => {
      const [nx, ny] = normal(a, i);
      return `${i ? 'L' : 'M'}${(p.x + nx * d).toFixed(1)},${(p.y + ny * d).toFixed(1)}`;
    })
    .join('');
}

/**
 * Listras diagonais da trança (cabo de 3 pernas): pequenos traços inclinados ao longo do cabo.
 * `a` deve ser o cabo INTEIRO; [de, ate] escolhe onde as listras começam. Assim um remendo
 * (trecho redesenhado por cima) gera exatamente as mesmas listras do cabo embaixo — sem costura.
 */
export function trancado(a: Amostra[], raio: number, passo = 6.5, inclinacao = 5, de?: number, ate?: number): string {
  if (a.length < 2) return '';
  const total = a[a.length - 1]!.s;
  const ini = Math.max(0, de ?? 0), fim = Math.min(total, ate ?? total);
  let d = '';
  let j = 0;
  const em = (s: number): [number, number, number, number] => {
    while (j < a.length - 2 && a[j + 1]!.s < s) j++;
    const p = a[j]!, q = a[j + 1]!;
    const t = Math.min(1, Math.max(0, (s - p.s) / Math.max(q.s - p.s, 1e-9)));
    const [nx, ny] = normal(a, j);
    return [p.x + (q.x - p.x) * t, p.y + (q.y - p.y) * t, nx, ny];
  };
  for (let s = Math.ceil(ini / passo) * passo; s <= fim && s + inclinacao <= total; s += passo) {
    j = 0;
    const [x1, y1, nx1, ny1] = em(s);
    const [x2, y2, nx2, ny2] = em(s + inclinacao);
    d += `M${(x1 + nx1 * raio).toFixed(1)},${(y1 + ny1 * raio).toFixed(1)}L${(x2 - nx2 * raio).toFixed(1)},${(y2 - ny2 * raio).toFixed(1)}`;
  }
  return d;
}

function intersecao(a: Amostra, b: Amostra, c: Amostra, d: Amostra) {
  const r = { x: b.x - a.x, y: b.y - a.y };
  const q = { x: d.x - c.x, y: d.y - c.y };
  const den = r.x * q.y - r.y * q.x;
  if (Math.abs(den) < 1e-9) return null;
  const t = ((c.x - a.x) * q.y - (c.y - a.y) * q.x) / den;
  const u = ((c.x - a.x) * r.y - (c.y - a.y) * r.x) / den;
  if (t < 0 || t >= 1 || u < 0 || u >= 1) return null;
  return { t, u };
}

/**
 * Até onde o trecho de cima precisa ir, a partir do cruzamento, para os dois cabos se separarem
 * de verdade (em cruzamentos rasos, ±15 px não basta e o de baixo "corta" o de cima).
 */
function alcance(sobre: Amostra[], i0: number, sob: Amostra[], j0: number, dir: 1 | -1, folga: number): number {
  const ini = Math.max(0, j0 - 80), fim = Math.min(sob.length - 1, j0 + 80);
  let i = i0;
  for (let passos = 0; passos < 60; passos++) {
    const prox = i + dir;
    if (prox < 0 || prox >= sobre.length) break;
    i = prox;
    const p = sobre[i]!;
    let min = Infinity;
    for (let j = ini; j <= fim; j++) min = Math.min(min, Math.hypot(sob[j]!.x - p.x, sob[j]!.y - p.y));
    if (min > folga) break;
  }
  return sobre[i]!.s + dir * 3;
}

/** Cruzamentos entre trechos (do mesmo cabo ou de cabos diferentes). Retorna o trecho que fica POR CIMA. */
export function cruzamentos(cabos: CaboGeo[], folga = 19): Trecho[] {
  const res: Trecho[] = [];
  const minDist = Math.ceil(30 / PASSO); // ignora vizinhos imediatos do mesmo cabo
  for (let i = 0; i < cabos.length; i++) {
    for (let j = i; j < cabos.length; j++) {
      const A = cabos[i]!.amostras, B = cabos[j]!.amostras;
      for (let a = 0; a < A.length - 1; a++) {
        for (let b = i === j ? a + minDist : 0; b < B.length - 1; b++) {
          const hit = intersecao(A[a]!, A[a + 1]!, B[b]!, B[b + 1]!);
          if (!hit) continue;
          const za = A[a]!.z + hit.t * (A[a + 1]!.z - A[a]!.z);
          const zb = B[b]!.z + hit.u * (B[b + 1]!.z - B[b]!.z);
          const aPorCima = za >= zb;
          const [cabo, sobre, iS, sob, jS, z] = aPorCima ? [i, A, a, B, b, za] : [j, B, b, A, a, zb];
          const L = cabos[cabo]!.comprimento;
          res.push({
            cabo,
            ini: Math.max(0, alcance(sobre, iS, sob, jS, -1, folga)),
            fim: Math.min(L, alcance(sobre, iS + 1, sob, jS, 1, folga)),
            z,
          });
        }
      }
    }
  }
  return res.sort((x, y) => x.z - y.z);
}

/** Trechos com z acima do limiar (ficam na frente de um objeto). */
export function trechosNaFrente(cabos: CaboGeo[], limiar = 0.15): Trecho[] {
  const res: Trecho[] = [];
  cabos.forEach((c, cabo) => {
    let ini: number | null = null;
    let soma = 0, qtd = 0;
    c.amostras.forEach((p, k) => {
      const frente = p.z > limiar;
      if (frente && ini === null) { ini = p.s; soma = 0; qtd = 0; }
      if (frente) { soma += p.z; qtd++; }
      const ultimo = k === c.amostras.length - 1;
      if (ini !== null && (!frente || ultimo)) {
        res.push({ cabo, ini, fim: p.s, z: soma / Math.max(qtd, 1) });
        ini = null;
      }
    });
  });
  return res.sort((x, y) => x.z - y.z);
}
