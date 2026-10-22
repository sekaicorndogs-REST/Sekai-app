import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Identifiant de build affiche en bas de l'ecran d'accueil : il permet de
// savoir en un coup d'oeil quelle version tourne sur une borne donnee, sans
// avoir a deviner. Meme principe que l'app de gestion.
const BUILD_ID = new Date().toISOString().slice(0, 16).replace('T', ' ');

export default defineConfig({
  define: { __BUILD_ID__: JSON.stringify(BUILD_ID) },
  plugins: [react()],
});
