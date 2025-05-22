// frontend/vite.config.ts
import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite'; // loadEnv might still be useful for .env files
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import basicSsl from '@vitejs/plugin-basic-ssl';
import { VitePWA } from 'vite-plugin-pwa';

// Load environment variables.
// process.env.NODE_ENV is 'production' for 'vite build' and 'development' for 'vite serve'.
const mode = process.env.NODE_ENV || 'development'; // Fallback if NODE_ENV isn't set by Vite somehow
const env = loadEnv(mode, process.cwd(), ''); // Loads .env, .env.development, .env.production etc.

const isProduction = mode === 'production';
const isDevelopment = mode === 'development';

// Determine base path
let base = '/';
const repository = 'flavorpal';

// Only set a subdirectory base path if it's a production build,
// not for Netlify (which serves from root), and GITHUB_REPOSITORY is set (indicating a GitHub Pages build)
if (isProduction && env.NETLIFY !== 'true' && repository) {
  base = `/${repository}/`;
}

// PWA Plugin Options
const pwaOptions = {
  registerType: 'autoUpdate',
  injectRegister: 'auto',
  devOptions: {
    // Enable full PWA features in dev only if explicitly set via .env.development
    enabled: env.ENABLE_PWA_DEV === 'true' && isDevelopment, 
    type: 'module',
  },
  manifest: {
    name: 'FlavorPal',
    short_name: 'FlavorPal',
    description: 'Your personal guide to remembering and discovering food product flavors.',
    theme_color: '#10B981',
    background_color: '#F3F4F6',
    display: 'standalone',
    scope: base, // Use the determined base path
    start_url: base, // Use the determined base path
    icons: [
      {
        src: 'icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: 'icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      }
    ]
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,json,vue,txt,woff2}'],
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/world\.openfoodfacts\.org\/.*/i,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'openfoodfacts-api-cache',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
          },
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      }
    ]
  }
};

// Dynamically build the plugins array
const plugins = [
  vue(),
  vueDevTools(),
];

if (isDevelopment) { 
  plugins.push(basicSsl()); // Add SSL only for local development server
}

// Configure PWA plugin based on mode and environment variable
if (isProduction || env.ENABLE_PWA_DEV === 'true') { 
  plugins.push(VitePWA(pwaOptions));
} else if (isDevelopment) {
  // For typical dev (PWA not explicitly enabled), just generate manifest
  // but don't register service worker to avoid SSL issues with dev-sw.js.
  const devMinimalPwaOptions = { 
    ...pwaOptions, 
    devOptions: { enabled: false, type: 'module' }, 
    workbox: undefined, 
    injectRegister: null, 
    registerType: undefined as any, 
  };
  plugins.push(VitePWA(devMinimalPwaOptions));
}

export default defineConfig({
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
  server: {
    https: isDevelopment, // Enable HTTPS for the dev server
    host: true, // Expose on local network
  },
});