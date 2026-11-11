import { describe, expect, it } from 'vitest';
import { derivar, migrarV1 } from './progresso';

describe('progresso', () => {
  it('soma o XP de todas as conclusões e guarda a última de cada lição', () => {
    const p = derivar([
      { licao: 'b', xp: 12, acertos: 2, total: 4, em: '2026-11-02T10:00:00.000Z' },
      { licao: 'a', xp: 15, acertos: 4, total: 4, em: '2026-11-03T10:00:00.000Z' },
      { licao: 'b', xp: 15, acertos: 4, total: 4, em: '2026-11-01T10:00:00.000Z' },
    ]);
    expect(p.xp).toBe(42);
    expect(p.concluidas.b.acertos).toBe(2);
    expect(p.historico.map((c) => c.em)).toEqual([...p.historico.map((c) => c.em)].sort());
  });

  it('migra o formato v1 (última conclusão por lição)', () => {
    const h = migrarV1({ concluidas: { a: { xp: 13, acertos: 3, total: 5, em: '2026-11-01T00:00:00.000Z' } } });
    expect(h).toEqual([{ licao: 'a', xp: 13, acertos: 3, total: 5, em: '2026-11-01T00:00:00.000Z' }]);
    expect(migrarV1({})).toEqual([]);
  });
});
