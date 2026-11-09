'use client';

import { DURACAO_S, type SinalSonoro } from '@/lib/ripeam/sinais';

let ctx: AudioContext | null = null;
function audio(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

/** Buzina de navio sintetizada: duas fundamentais em dente de serra + passa-baixa. Devolve os osciladores (para cancelar). */
function buzina(a: AudioContext, inicio: number, dur: number): OscillatorNode[] {
  const g = a.createGain();
  const f = a.createBiquadFilter();
  f.type = 'lowpass';
  f.frequency.value = 1100;
  g.gain.setValueAtTime(0, inicio);
  g.gain.linearRampToValueAtTime(0.22, inicio + 0.06);
  g.gain.setValueAtTime(0.22, inicio + dur - 0.12);
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
  f.connect(g);
  g.connect(a.destination);
  return osc;
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

/** Toca o sinal. Devolve um controle para saber quando acaba e para cancelar. */
export function tocarSinal(sinal: SinalSonoro, opts: OpcoesToque = {}): Reproducao {
  const a = audio();
  const intervalo = opts.lento ? 2 : 1;
  let t = a.currentTime + 0.1;
  const timers: number[] = [];
  const osc: OscillatorNode[] = [];
  sinal.forEach((toque, i) => {
    const dur = DURACAO_S[toque];
    osc.push(...buzina(a, t, dur));
    timers.push(window.setTimeout(() => opts.aoApitar?.(i, dur), (t - a.currentTime) * 1000));
    t += dur + intervalo;
  });
  const total = (t - a.currentTime - intervalo) * 1000;
  let resolver: () => void = () => {};
  const fim = new Promise<void>((r) => {
    resolver = r;
    timers.push(window.setTimeout(r, total));
  });
  return {
    fim,
    cancelar: () => {
      timers.forEach((x) => window.clearTimeout(x));
      osc.forEach((o) => { try { o.stop(); } catch { /* já parou */ } });
      resolver();
    },
  };
}

/** Efeito curto de acerto/erro. */
export function bip(ok: boolean) {
  const a = audio();
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
    g.connect(a.destination);
    o.start(t0);
    o.stop(t0 + 0.25);
  });
}
