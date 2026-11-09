import { Cena } from '@/components/cenas/Cena';
import { Marujo } from '@/components/marujo/Marujo';
import { LICOES } from '@/content/licoes';
import { SINAIS, notacao } from '@/lib/ripeam/sinais';

export const metadata = { title: 'Revisão de conteúdo · Bom Marujo', robots: { index: false } };

/** Página interna de revisão: todo o conteúdo das lições, cena antes e depois da resposta. */
export default function Revisao() {
  const card: React.CSSProperties = { background: 'var(--card)', border: '2px solid var(--borda)', borderRadius: 16, padding: 14, marginBottom: 18 };
  const cena: React.CSSProperties = { border: '3px solid var(--tinta)', borderRadius: 14, overflow: 'hidden', background: '#000' };
  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: 16 }}>
      <h1 style={{ fontWeight: 900 }}>Revisão de conteúdo</h1>
      {LICOES.map((l) => (
        <section key={l.id}>
          <h2 style={{ fontWeight: 900, marginTop: 28 }}>{l.titulo} <small style={{ color: 'var(--texto-2)' }}>({l.id} · tema {l.temaId})</small></h2>
          {l.conceitos.map((c) => (
            <article key={c.id} data-item={`${l.id}/${c.id}`} style={card}>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--azul)' }}>CONCEITO · {c.id}</div>
              <h3 style={{ margin: '4px 0 10px' }}>{c.titulo}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, alignItems: 'start' }}>
                {c.cena && <div style={cena}><Cena spec={c.cena} revelado /></div>}
                <div>
                  <p style={{ margin: 0, lineHeight: 1.45 }}>{c.texto}</p>
                  {c.falaMarujo && (
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginTop: 10 }}>
                      <Marujo pose={c.pose ?? 'ensinando'} altura={90} animacao="nenhuma" />
                      <em>“{c.falaMarujo}”</em>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
          {l.questoes.map((q) => (
            <article key={q.id} data-item={`${l.id}/${q.id}`} style={card}>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--azul)' }}>QUESTÃO · {q.id}{q.som ? ` · som: ${notacao(SINAIS[q.som].sinal)} (${q.som})` : ''}</div>
              <h3 style={{ margin: '4px 0 10px' }}>{q.enunciado}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><div style={{ fontSize: 12, fontWeight: 800 }}>ANTES da resposta</div><div style={cena}><Cena spec={q.cena} /></div></div>
                <div><div style={{ fontSize: 12, fontWeight: 800 }}>DEPOIS da resposta</div><div style={cena}><Cena spec={q.cena} revelado apito={{ n: 1, dur: 1 }} /></div></div>
              </div>
              <ol style={{ margin: '10px 0 6px' }}>
                {q.opcoes.map((o, i) => (
                  <li key={i} style={{ fontWeight: i === q.correta ? 900 : 600, color: i === q.correta ? 'var(--ok-escuro)' : undefined }}>
                    {o} {i === q.correta && '✓'}
                  </li>
                ))}
              </ol>
              <p style={{ margin: '4px 0', lineHeight: 1.45 }}><b>Explicação:</b> {q.explicacao}</p>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--texto-2)' }}>{q.referencia}</p>
            </article>
          ))}
        </section>
      ))}
    </main>
  );
}
