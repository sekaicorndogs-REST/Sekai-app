import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // On enregistre nous-mêmes dans main.tsx pour pouvoir vérifier les mises
      // à jour au retour au premier plan : sur iPhone, rouvrir l'app depuis
      // l'arrière-plan n'est pas un vrai lancement, donc la version installée
      // pouvait rester en place plusieurs heures.
      injectRegister: null,
      includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'logo-sekai.png'],
      manifest: {
        name: 'Sekai Corndogs',
        short_name: 'Sekai',
        description: 'Gestion Sekai Corndogs — stock, horaires, finances, paie',
        lang: 'fr',
        theme_color: '#e8213a',
        background_color: '#faebd7',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,webp,woff2}'],
        // Ne jamais servir index.html en cache pour les requêtes vers l'API Supabase
        navigateFallbackDenylist: [/^\/rest\//, /^\/auth\//],
        runtimeCaching: [
          {
            // Police Google (CSS)
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts-stylesheets' },
          },
          {
            // Police Google (fichiers de police)
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Données Supabase (GET) : réseau d'abord, cache en secours hors-ligne
            urlPattern: ({ url, request }) =>
              url.hostname.endsWith('.supabase.co') && request.method === 'GET',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        // Sépare les librairies (React, icônes) dans un chunk mis en cache à part :
        // il ne change pas quand le code de l'app évolue → chargements suivants plus rapides.
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('lucide-react')) return 'icons'
            if (id.includes('react')) return 'react-vendor'
          }
        },
      },
    },
  },
})
