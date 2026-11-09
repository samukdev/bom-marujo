import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Bom Marujo',
    short_name: 'Bom Marujo',
    description: 'Estude para Arrais-Amador e Motonauta com lições curtas, cenas animadas e sinais sonoros.',
    lang: 'pt-BR',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#F4F7FB',
    theme_color: '#1765D8',
    icons: [
      { src: '/brand/icone-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/brand/icone-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/brand/icone-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
