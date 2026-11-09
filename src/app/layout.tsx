import type { Metadata, Viewport } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';
import { asset } from '@/lib/base';

const nunito = Nunito({
  variable: '--fonte',
  subsets: ['latin'],
  weight: ['600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Bom Marujo',
  description: 'Estude para Arrais-Amador e Motonauta com lições curtas, cenas animadas e sinais sonoros.',
  manifest: asset('/manifest.webmanifest'),
};

export const viewport: Viewport = {
  themeColor: '#1765D8',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="pt-BR" className={nunito.variable}>
      <body>{children}</body>
    </html>
  );
}
