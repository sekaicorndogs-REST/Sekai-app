import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Sépare les librairies (React, icônes) dans un chunk mis en cache à part :
        // il ne change pas quand le code de l'app évolue → chargements suivants plus rapides.
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('lucide-react')) return 'icons';
            if (id.includes('react')) return 'react-vendor';
          }
        },
      },
    },
  },
})
