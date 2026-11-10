'use client';

import { DURACAO_S, type SinalSonoro } from '@/lib/ripeam/sinais';

/*
 * Áudio no celular:
 *  - iPhone: o Web Audio sai pelo canal de "toque" e fica mudo com a chave de silencioso.
 *    iOS 17+ tem `navigator.audioSession.type = 'playback'`; nos anteriores, um <audio> silencioso
 *    tocando junto põe a sessão em modo mídia.
 *  - O contexto só destrava dentro de um toque do usuário e pode ficar `suspended`/`interrupted`
 *    (ligação, troca de app): `pronto()` sempre espera o `resume()` antes de agendar o som.
 *  - Alto-falante de celular quase não reproduz abaixo de ~300 Hz: a buzina ganha um realce em
 *    médios e passa por um compressor, para ser ouvida sem perder o timbre grave.
 */

type ComAudioSession = Navigator & { audioSession?: { type: string } };
type JanelaWebkit = Window & { webkitAudioContext?: typeof AudioContext };

let ctx: AudioContext | null = null;
let saida: AudioNode | null = null;

function contexto(): AudioContext {
  if (!ctx) {
    try {
      const sessao = (navigator as ComAudioSession).audioSession;
      if (sessao) sessao.type = 'playback';
    } catch { /* navegador sem audioSession */ }
    const Ctor = window.AudioContext ?? (window as JanelaWebkit).webkitAudioContext!;
    ctx = new Ctor();
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.ratio.value = 4;
    const mestre = ctx.createGain();
    mestre.gain.value = 0.9;
    comp.connect(mestre);
    mestre.connect(ctx.destination);
    saida = comp;
  }
  return ctx;
}

/* ---- iOS < 17: <audio> silencioso em loop enquanto o som toca ---- */
const precisaTruqueIOS = () =>
  typeof navigator !== 'undefined' &&
  !(navigator as ComAudioSession).audioSession &&
  /iP(hone|ad|od)/.test(navigator.userAgent + (navigator.maxTouchPoints > 1 && /Mac/.test(navigator.userAgent) ? 'iPad' : ''));

let silencio: HTMLAudioElement | null = null;
let usando = 0; // quantos sons precisam do modo mídia agora
function wavSilencioso(): string {
  // 0,1 s de silêncio, 8 kHz, 8 bits mono
  const n = 800;
  const b = new Uint8Array(44 + n);
  const v = new DataView(b.buffer);
  const txt = (o: number, s: string) => [...s].forEach((c, i) => (b[o + i] = c.charCodeAt(0)));
  txt(0, 'RIFF'); v.setUint32(4, 36 + n, true); txt(8, 'WAVEfmt ');
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, 8000, true); v.setUint32(28, 8000, true); v.setUint16(32, 1, true); v.setUint16(34, 8, true);
  txt(36, 'data'); v.setUint32(40, n, true); b.fill(128, 44);
  let s = '';
  b.forEach((x) => (s += String.fromCharCode(x)));
  return 'data:audio/wav;base64,' + btoa(s);
}
function modoMidia(ligado: boolean) {
  if (!precisaTruqueIOS()) return;
  if (!silencio) {
    silencio = new Audio(wavSilencioso());
    silencio.loop = true;
    silencio.setAttribute('playsinline', '');
  }
  usando = Math.max(0, usando + (ligado ? 1 : -1));
  if (ligado && usando === 1) void silencio.play().catch(() => {});
  if (!ligado && usando === 0) silencio.pause();
}

/** Garante o contexto rodando. Chame o início DENTRO do toque do usuário (o `resume` precisa do gesto). */
async function pronto(): Promise<AudioContext> {
  const a = contexto();
  if (a.state !== 'running') await a.resume().catch(() => {});
  return a;
}

/** Destrava o áudio no primeiro toque da página (antes de qualquer som). */
function destravar() {
  modoMidia(true);
  void pronto().then((a) => {
    const b = a.createBuffer(1, 1, 22050);
    const s = a.createBufferSource();
    s.buffer = b;
    s.connect(a.destination);
    s.start();
    modoMidia(false);
  });
}
if (typeof window !== 'undefined') {
  for (const ev of ['pointerdown', 'touchend', 'keydown'] as const) window.addEventListener(ev, destravar, { once: true, capture: true });
}

/** Buzina de navio sintetizada: duas fundamentais em dente de serra + passa-baixa e realce em médios. */
function buzina(a: AudioContext, inicio: number, dur: number): { osc: OscillatorNode[]; ganho: GainNode } {
  const g = a.createGain();
  const f = a.createBiquadFilter();
  f.type = 'lowpass';
  f.frequency.value = 1800;
  // realce em ~700 Hz: os harmônicos que o alto-falante do celular reproduz
  const realce = a.createBiquadFilter();
  realce.type = 'peaking';
  realce.frequency.value = 700;
  realce.Q.value = 0.8;
  realce.gain.value = 9;
  g.gain.setValueAtTime(0, inicio);
  g.gain.linearRampToValueAtTime(0.3, inicio + 0.06);
  g.gain.setValueAtTime(0.3, inicio + dur - 0.12);
  g.gain.linearRampToValueAtTime(0, inicio + dur);
  const osc: OscillatorNode[] = [];
  for (const fr of [118, 177]) {
    const o = a.createOscillator();
    o.type = 'sawtooth';
    o.frequency.value = fr;
    o.connect(f);
    o.start(inicio);
    o.stop(inicio + dur + 0.05);
    osc.push(o);
  }
  f.connect(realce);
  realce.connect(g);
  g.connect(saida ?? a.destination);
  return { osc, ganho: g };
}

export interface OpcoesToque {
  /** modo 🐢: dobra o intervalo entre apitos (a duração de cada apito não muda — ela é parte da regra) */
  lento?: boolean;
  /** chamado no início de cada apito (para sincronizar a animação) */
  aoApitar?: (indice: number, duracaoS: number) => void;
}

export interface Reproducao {
  /** resolve quando o sinal termina (ou é cancelado) */
  fim: Promise<void>;
  /** para o som e os eventos de apito na hora (trocar de questão, desmontar) */
  cancelar: () => void;
}

/** Toca o sinal. Devolve um controle para saber quando acaba e para cancelar. Chame dentro do toque do usuário. */
export function tocarSinal(sinal: SinalSonoro, opts: OpcoesToque = {}): Reproducao {
  const timers: number[] = [];
  const vozes: { osc: OscillatorNode[]; ganho: GainNode }[] = [];
  let cancelado = false;
  let resolver: () => void = () => {};
  const fim = new Promise<void>((r) => (resolver = r));
  let encerrado = false;
  const encerrar = () => {
    if (encerrado) return;
    encerrado = true;
    modoMidia(false);
    resolver();
  };
  modoMidia(true);
  void pronto().then((a) => {
    if (cancelado) return;
    const intervalo = opts.lento ? 2 : 1;
    let t = a.currentTime + 0.1;
    sinal.forEach((toque, i) => {
      const dur = DURACAO_S[toque];
      vozes.push(buzina(a, t, dur));
      timers.push(window.setTimeout(() => opts.aoApitar?.(i, dur), (t - a.currentTime) * 1000));
      t += dur + intervalo;
    });
    timers.push(window.setTimeout(encerrar, (t - a.currentTime - intervalo) * 1000));
  });
  return {
    fim,
    cancelar: () => {
      cancelado = true;
      timers.forEach((x) => window.clearTimeout(x));
      const a = ctx;
      vozes.forEach(({ osc, ganho }) => {
        if (a) {
          // rampa de 20 ms: cortar o som seco faz um estalo
          ganho.gain.cancelScheduledValues(a.currentTime);
          ganho.gain.setValueAtTime(ganho.gain.value, a.currentTime);
          ganho.gain.linearRampToValueAtTime(0, a.currentTime + 0.02);
        }
        osc.forEach((o) => { try { o.stop(a ? a.currentTime + 0.03 : 0); } catch { /* já parou */ } });
      });
      encerrar();
    },
  };
}

/** Efeito curto de acerto/erro. */
export function bip(ok: boolean) {
  modoMidia(true);
  window.setTimeout(() => modoMidia(false), 600);
  void pronto().then((a) => {
    const t = a.currentTime;
    (ok ? [660, 880] : [300, 220]).forEach((fr, i) => {
      const o = a.createOscillator();
      const g = a.createGain();
      o.type = ok ? 'triangle' : 'square';
      o.frequency.value = fr;
      const t0 = t + i * 0.09;
      g.gain.setValueAtTime(0, t0);
      g.gain.linearRampToValueAtTime(ok ? 0.15 : 0.05, t0 + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.22);
      o.connect(g);
      g.connect(saida ?? a.destination);
      o.start(t0);
      o.stop(t0 + 0.25);
    });
  });
}
