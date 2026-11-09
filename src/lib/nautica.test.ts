import { describe, expect, it } from 'vitest';
import { luzesVisiveis, projetarX, setorVisivel } from './ripeam/luzes';
import { SINAIS, notacao } from './ripeam/sinais';
import { bordoParaDeixar, LATERAIS_REGIAO_B } from './iala/boias';

const cores = (ls: { cor: string }[]) => ls.map((l) => l.cor).sort();

describe('RIPEAM — setores de luz (Regra 21)', () => {
  it('bem pela proa vê as duas luzes de bordo e o mastro, não o alcançado', () => {
    expect(setorVisivel('boreste', 0)).toBe(true);
    expect(setorVisivel('bombordo', 0)).toBe(true);
    expect(setorVisivel('mastro', 0)).toBe(true);
    expect(setorVisivel('alcancado', 0)).toBe(false);
  });
  it('pelo través de boreste vê verde, não vermelho', () => {
    expect(setorVisivel('boreste', 90)).toBe(true);
    expect(setorVisivel('bombordo', 90)).toBe(false);
  });
  it('pela popa só vê o alcançado', () => {
    expect(setorVisivel('alcancado', 180)).toBe(true);
    expect(setorVisivel('mastro', 180)).toBe(false);
    expect(setorVisivel('boreste', 180)).toBe(false);
  });
  it('limite de 22,5° por ante a ré do través', () => {
    expect(setorVisivel('boreste', 112.5)).toBe(true);
    expect(setorVisivel('boreste', 113)).toBe(false);
    expect(setorVisivel('alcancado', 113)).toBe(true);
  });
});

describe('RIPEAM — luzes por tipo de embarcação', () => {
  it('propulsão mecânica <50 m de proa: branca + verde + vermelha', () => {
    expect(cores(luzesVisiveis({ tipo: 'propulsao-mecanica' }, 0))).toEqual(['branca', 'verde', 'vermelha']);
  });
  it('propulsão mecânica ≥50 m tem dois mastros', () => {
    const v = luzesVisiveis({ tipo: 'propulsao-mecanica', porte: 'maior50' }, 0);
    expect(v.filter((l) => l.setor === 'mastro')).toHaveLength(2);
  });
  it('vela de proa: só bordos, sem luz de mastro', () => {
    expect(cores(luzesVisiveis({ tipo: 'vela' }, 0))).toEqual(['verde', 'vermelha']);
  });
  it('fundeada <50 m: uma circular branca de qualquer ângulo', () => {
    for (const a of [0, 90, 180, 270]) expect(cores(luzesVisiveis({ tipo: 'fundeada' }, a))).toEqual(['branca']);
  });
  it('sem governo e sem seguimento: duas vermelhas circulares', () => {
    expect(cores(luzesVisiveis({ tipo: 'sem-governo', comSeguimento: false }, 45))).toEqual(['vermelha', 'vermelha']);
  });
});

describe('Projeção na tela do observador', () => {
  it('de proa, o boreste (verde) fica à ESQUERDA e o bombordo (vermelho) à DIREITA', () => {
    expect(projetarX(0, 0.5, 0)).toBeLessThan(0);
    expect(projetarX(0, -0.5, 0)).toBeGreaterThan(0);
  });
  it('pelo través de boreste, a proa aparece à direita', () => {
    expect(projetarX(0.5, 0, 90)).toBeGreaterThan(0);
  });
  it('pela popa, o boreste fica à DIREITA de quem observa', () => {
    expect(projetarX(0, 0.5, 180)).toBeGreaterThan(0);
  });
});

describe('RIPEAM — sinais sonoros (Regra 34)', () => {
  it('1, 2 e 3 curtos', () => {
    expect(notacao(SINAIS['guinando-boreste'].sinal)).toBe('•');
    expect(notacao(SINAIS['guinando-bombordo'].sinal)).toBe('• •');
    expect(notacao(SINAIS['maquinas-atras'].sinal)).toBe('• • •');
  });
  it('dúvida tem pelo menos 5 curtos', () => {
    expect(SINAIS.duvida.sinal.length).toBeGreaterThanOrEqual(5);
    expect(SINAIS.duvida.sinal.every((t) => t === 'curto')).toBe(true);
  });
});

describe('IALA região B', () => {
  it('entrando: vermelha por boreste, verde por bombordo', () => {
    expect(bordoParaDeixar('vermelha', 'entrando')).toBe('boreste');
    expect(bordoParaDeixar('verde', 'entrando')).toBe('bombordo');
  });
  it('saindo: inverte', () => {
    expect(bordoParaDeixar('vermelha', 'saindo')).toBe('bombordo');
  });
  it('formatos: vermelha cônica, verde cilíndrica', () => {
    expect(LATERAIS_REGIAO_B.boreste.formato).toBe('conico');
    expect(LATERAIS_REGIAO_B.bombordo.formato).toBe('cilindrico');
  });
});
