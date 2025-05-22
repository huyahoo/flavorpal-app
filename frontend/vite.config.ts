// frontend/vite.config.ts
import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv, type UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import basicSsl from '@vitejs/plugin-basic-ssl';
import { VitePWA, type VitePWAOptions, type ManifestOptions } from 'vite-plugin-pwa';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), ''); 
  const isProduction = mode === 'production';
  const isDevelopment = mode === 'development';

  let base = '/';
  const repositoryNameFromAction = env.GITHUB_REPOSITORY 
                                ? env.GITHUB_REPOSITORY.split('/')[1] 
                                : null;
  if (isProduction && env.NETLIFY !== 'true' && repositoryNameFromAction) {
    base = `/${repositoryNameFromAction}/`;
  }

  const manifestOptions: Partial<ManifestOptions> = {
    name: 'FlavorPal',
    short_name: 'FlavorPal',
    description: 'Your personal guide to remembering and discovering food product flavors.',
    theme_color: '#10B981',
    background_color: '#F3F4F6',
    display: 'standalone',
    scope: base,
    start_url: base,
    icons: [
      { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
    ]
  };

  const pwaOptions: Partial<VitePWAOptions> = {
    registerType: 'autoUpdate',
    injectRegister: 'auto',
    devOptions: {
      enabled: env.ENABLE_PWA_DEV === 'true' && isDevelopment, 
      type: 'module',
    },
    manifest: manifestOptions,
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg,json,vue,txt,woff2}'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/world\.openfoodfacts\.org\/.*/i,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'openfoodfacts-api-cache',
            expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 7 },
            cacheableResponse: { statuses: [0, 200] }
          }
        }
      ]
    }
  };

  const plugins = [ vue(), vueDevTools() ];

  if (isDevelopment) { 
    plugins.push(basicSsl());
  }

  if (isProduction || env.ENABLE_PWA_DEV === 'true') { 
    plugins.push(VitePWA(pwaOptions));
  } else if (isDevelopment) {
    const devMinimalPwaOptions: Partial<VitePWAOptions> = { 
      manifest: manifestOptions,
      devOptions: { enabled: false, type: 'module' }, 
      workbox: undefined, 
      injectRegister: null, 
      registerType: undefined, 
    };
    plugins.push(VitePWA(devMinimalPwaOptions));
  }
  
  const config: UserConfig = {
    plugins: plugins,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    base: base, 
    build: {
      outDir: 'dist', 
    },
    server: {},
  };

  if (isDevelopment) {
    config.server!.https = {};
    config.server!.host = true;
  }

  return config;
});
