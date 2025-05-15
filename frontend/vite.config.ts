import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// This constant is primarily for GitHub Pages deployment via GitHub Actions.
// For local builds intended for Surge.sh, process.env.GITHUB_REPOSITORY will be undefined.
const repositoryName = 'flavorpal-app'

export default defineConfig(({ command }) => {
  // Check if building in a Netlify environment
  const isNetlify = process.env.NETLIFY === 'true';
  
  // Default base path is '/', which is correct for Surge.sh and local development
  let base = '/'; 

  // This condition is for GitHub Pages deployment.
  // When building locally for Surge.sh, process.env.GITHUB_REPOSITORY will be undefined,
  // so 'base' will remain '/'.
  if (command === 'build' && !isNetlify && process.env.GITHUB_REPOSITORY) {
    // Only set repository-specific base for GitHub Pages builds via Actions
    base = `/${repositoryName}/`;
  }

  return {
    plugins: [
      vue(),
      vueDevTools(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    base: base, // This will be '/' for local builds intended for Surge.sh
    build: {
      outDir: 'dist', // Output directory for the build, relative to `frontend/`
    },
  }
})