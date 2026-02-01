import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Apartman Plus',
    short_name: 'Apartman+',
    description: 'Modern Site ve Apartman Yönetim Platformu',
    start_url: '/',
    display: 'standalone',
    background_color: '#F8F9FA',
    theme_color: '#1A237E',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
