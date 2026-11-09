import Link from 'next/link';
import { CenaInterativa } from '@/components/cenas/CenaInterativa';
import { NOS, type NoId } from '@/lib/nos/catalogo';
import { USOS_NOS } from '@/content/nos';

export const metadata = { title: 'Caderno de nós · Bom Marujo' };

export default function CadernoDeNos() {
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '16px 16px 48px' }}>
      <Link href="/" style={{ color: 'var(--azul)', fontWeight: 800, textDecoration: 'none' }}>← Trilha</Link>
      <h1 style={{ fontSize: 26, fontWeight: 900, margin: '12px 0 4px' }}>🪢 Caderno de nós</h1>
      <p style={{ margin: '0 0 20px', color: 'var(--texto-2)' }}>Os nós que caem na prova, para que serve cada um e como ele fica.</p>
      <div style={{ display: 'grid', gap: 22 }}>
        {(Object.keys(NOS) as NoId[]).map((id) => (
          <section key={id} style={{ background: 'var(--card)', border: '2px solid var(--borda)', borderRadius: 18, overflow: 'hidden' }}>
            <div style={{ padding: '12px 12px 0' }}>
              <CenaInterativa spec={{ tipo: 'no', no: id }} revelado />
            </div>
            <div style={{ padding: '12px 16px 16px' }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900 }}>{NOS[id].nome}</h2>
              <p style={{ margin: '4px 0 0', lineHeight: 1.45 }}>{USOS_NOS[id].uso}</p>
              {USOS_NOS[id].dica && <p style={{ margin: '6px 0 0', fontSize: 14, color: 'var(--texto-2)' }}>💡 {USOS_NOS[id].dica}</p>}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
