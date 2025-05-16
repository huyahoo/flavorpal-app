import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import basicSsl from '@vitejs/plugin-basic-ssl';
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    basicSsl(),
    VitePWA({
      registerType: 'autoUpdate', // Automatically update service worker when new content is available
      injectRegister: 'auto', // Or 'script' or null
      devOptions: {
        enabled: true // Enable PWA features in development for testing
      },
      manifest: {
        name: 'FlavorPal',
        short_name: 'FlavorPal',
        description: 'Your personal guide to remembering and discovering food product flavors.',
        theme_color: '#10B981', // Your primary green color
        background_color: '#F3F4F6', // Your light gray background
        display: 'standalone', // Key for app-like feel (no browser chrome)
        scope: '/', // Set scope to your base path
        start_url: '/', // Start URL should also respect the base path
        icons: [
          {
            src: 'icon-192.png', // You'll need to create these icons
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icon-512.png', // Maskable icon
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          }
        ]
      },
      // Service worker configuration (workbox options)
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,vue,txt,woff2}'], // Files to cache
        runtimeCaching: [ // Example: Cache API calls to Open Food Facts
          {
            urlPattern: /^https:\/\/world\.openfoodfacts\.org\/.*/i,
            handler: 'NetworkFirst', // Or 'CacheFirst', 'StaleWhileRevalidate'
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
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  base: '/', // Always use '/' for Surge deployments
  build: {
    outDir: 'dist', // Output directory for the build
  },
  server: {
    host: true, // Expose on local network
  },
});