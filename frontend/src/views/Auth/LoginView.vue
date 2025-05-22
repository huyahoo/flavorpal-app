<template>
  <div class="flex flex-col items-center justify-center h-full bg-gradient-to-br from-flavorpal-green to-emerald-400 p-4 sm:p-6 antialiased">
    <div class="w-full max-w-sm bg-white p-6 sm:p-10 rounded-2xl shadow-2xl transform transition-all hover:scale-105 duration-300 ease-in-out">
      <div class="text-center mb-8">
        <div class="inline-block p-3 bg-flavorpal-green rounded-full mb-4 shadow-lg">
          <img src="@/assets/flavorpal-logo.svg" alt="FlavorPal Logo" class="w-12 h-12" />
        </div>
        <h1 class="text-3xl font-bold text-flavorpal-gray-dark tracking-tight">Welcome Back!</h1>
        <p class="text-flavorpal-gray mt-2 text-sm">Log in to your FlavorPal account.</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div class="relative">
          <label for="emailLogin" class="block text-sm font-medium text-flavorpal-gray-dark mb-1">Email Address</label>
          <div class="relative rounded-lg shadow-sm">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <input
              type="email"
              id="emailLogin"
              v-model="email"
              required
              autocomplete="email"
              class="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-flavorpal-green focus:border-flavorpal-green sm:text-sm transition-shadow"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div class="relative">
          <label for="passwordLogin" class="block text-sm font-medium text-flavorpal-gray-dark mb-1">Password</label>
           <div class="relative rounded-lg shadow-sm">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
            </div>
            <input
              type="password"
              id="passwordLogin"
              v-model="password"
              required
              autocomplete="current-password"
              class="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-flavorpal-green focus:border-flavorpal-green sm:text-sm transition-shadow"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div v-if="authStore.error" class="p-3 bg-red-50 border-l-4 border-red-400 text-red-700 text-sm rounded-md" role="alert">
          <p class="font-medium">Oops!</p>
          <p>{{ authStore.error }}</p>
        </div>

        <button
          type="submit"
          :disabled="authStore.loading"
          class="w-full flex justify-center items-center bg-flavorpal-green hover:bg-flavorpal-green-dark text-white font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-flavorpal-green-dark transition-all duration-150 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:bg-flavorpal-green-dark transform active:scale-95"
        >
          <svg v-if="authStore.loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ authStore.loading ? 'Signing In...' : 'Sign In' }}
        </button>
      </form>

      <p class="mt-8 text-center text-sm text-flavorpal-gray">
        Don't have an account?
        <router-link to="/register" class="font-semibold text-flavorpal-green hover:text-flavorpal-green-dark hover:underline">
          Sign up now
        </router-link>
      </p>
    </div>
     <footer class="text-center mt-8">
        <p class="text-xs text-emerald-100">&copy; {{ new Date().getFullYear() }} FlavorPal. Happy Hacking!</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../../store/auth'; // Import the authentication store

// Reactive variables for form inputs
const email = ref<string>('');
const password = ref<string>('');

const authStore = useAuthStore(); // Get an instance of the auth store

// Function to handle form submission for login
const handleLogin = async () => {
  // Basic client-side validation
  if (!email.value.trim() || !password.value.trim()) {
    authStore.error = 'Please enter both email and password.'; // Set error message in the store
    return;
  }

  const credentials: LoginCredentials = {
    username: email.value.trim(),
    password: password.value,
  };

  await authStore.login(credentials);
};
</script>

<style scoped>
/* Scoped styles specific to this component can be added here if needed, 
   though Tailwind aims to minimize the need for custom CSS. */
/* Example: Add a subtle animation to the card on hover if not using transform directly */
/* .transform:hover { transform: translateY(-5px); } */
</style>
