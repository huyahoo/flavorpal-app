// src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia' // Import Pinia

import App from './App.vue'
import router from './router'       // Will create this in a later step
import './assets/main.css'      // Import global styles (including Tailwind)

// Create the Vue application instance
const app = createApp(App)

// Create a Pinia instance for state management
const pinia = createPinia()

// Register Pinia with the Vue application
app.use(pinia)

// Register Vue Router with the Vue application
app.use(router)

// Mount the application to the DOM element with id="app" in index.html
app.mount('#app')
