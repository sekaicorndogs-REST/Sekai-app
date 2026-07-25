import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sekaicorndogs.app',
  appName: 'Sekai Corndogs',
  webDir: 'dist',
  backgroundColor: '#faebd7',
  android: {
    // Autorise le webview à charger l'API Supabase (HTTPS)
    allowMixedContent: false,
  },
};

export default config;
