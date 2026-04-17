import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.finlit.ai',
  appName: 'FinLit',
  webDir: 'out',
  server: {
    url: 'https://finlit-ai.vercel.app/',
    cleartext: true
  }
};

export default config;
