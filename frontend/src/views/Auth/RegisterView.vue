<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-flavorpal-green to-emerald-400 p-4 sm:p-6 antialiased">
    <div class="w-full max-w-md bg-white p-6 sm:p-10 rounded-2xl shadow-2xl transform transition-all hover:scale-105 duration-300 ease-in-out">
      <div class="text-center mb-8">
        <div class="inline-block p-3 bg-flavorpal-green rounded-full mb-4 shadow-lg">
          <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v11.494m0 0A8.489 8.489 0 0019.5 12C19.5 8.28 16.22 5.253 12 5.253S4.5 8.28 4.5 12a8.489 8.489 0 007.5 5.747m0 0A3.75 3.75 0 0015.75 12H8.25A3.75 3.75 0 0012 17.747zM12 6.253V5.5A2.25 2.25 0 009.75 3.25H8.25A2.25 2.25 0 006 5.5v.753m6 0A2.25 2.25 0 0114.25 5.5h1.5A2.25 2.25 0 0118 5.5v.753"></path></svg>
        </div>
        <h1 class="text-3xl font-bold text-flavorpal-gray-dark tracking-tight">Create Your Account</h1>
        <p class="text-flavorpal-gray mt-2 text-sm">Join FlavorPal and start your culinary adventure!</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-5">
        <div class="relative">
          <label for="emailRegister" class="block text-sm font-medium text-flavorpal-gray-dark mb-1">Email Address</label>
          <div class="relative rounded-lg shadow-sm">
             <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <input
              type="email"
              id="emailRegister"
              v-model="email"
              required
              autocomplete="email"
              class="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-flavorpal-green focus:border-flavorpal-green sm:text-sm transition-shadow"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div class="relative">
          <label for="passwordRegister" class="block text-sm font-medium text-flavorpal-gray-dark mb-1">Password</label>
          <div class="relative rounded-lg shadow-sm">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
            </div>
            <input
              type="password"
              id="passwordRegister"
              v-model="password"
              required
              minlength="6"
              autocomplete="new-password"
              class="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-flavorpal-green focus:border-flavorpal-green sm:text-sm transition-shadow"
              placeholder="Minimum 6 characters"
            />
          </div>
        </div>

        <div class="relative">
          <label for="confirmPasswordRegister" class="block text-sm font-medium text-flavorpal-gray-dark mb-1">Confirm Password</label>
          <div class="relative rounded-lg shadow-sm">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
            </div>
            <input
              type="password"
              id="confirmPasswordRegister"
              v-model="confirmPassword"
              required
              autocomplete="new-password"
              class="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-flavorpal-green focus:border-flavorpal-green sm:text-sm transition-shadow"
              placeholder="Retype password"
            />
          </div>
        </div>
        
        <div class="relative">
          <label for="healthFlagsRegister" class="block text-sm font-medium text-flavorpal-gray-dark mb-1">
            Dietary Flags <span class="text-xs text-gray-500">(optional, comma-separated)</span>
          </label>
          <input
            type="text"
            id="healthFlagsRegister"
            v-model="healthFlagsInput"
            class="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-flavorpal-green focus:border-flavorpal-green sm:text-sm transition-shadow shadow-sm"
            placeholder="e.g., nuts, gluten, low sugar"
          />
        </div>

        <div v-if="authStore.error" class="p-3 bg-red-50 border-l-4 border-red-400 text-red-700 text-sm rounded-md" role="alert">
          <p class="font-medium">Heads up!</p>
          <p>{{ authStore.error }}</p>
        </div>
        <div v-if="registrationMessage" class="p-3 bg-green-50 border-l-4 border-green-400 text-green-700 text-sm rounded-md" role="alert">
          <p class="font-medium">Success!</p>
          <p>{{ registrationMessage }}</p>
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
          {{ authStore.loading ? 'Creating Account...' : 'Create Account' }}
        </button>
      </form>

      <p class="mt-8 text-center text-sm text-flavorpal-gray">
        Already have an account?
        <router-link to="/login" class="font-semibold text-flavorpal-green hover:text-flavorpal-green-dark hover:underline">
          Sign in instead
        </router-link>
      </p>
    </div>
    <footer class="text-center mt-8">
        <p class="text-xs text-emerald-100">&copy; {{ new Date().getFullYear() }} FlavorPal. Let's get tasting!</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../../store/auth'; // Import the authentication store

// Reactive variables for form inputs
const email = ref<string>('');
const password = ref<string>('');
const confirmPassword = ref<string>('');
const healthFlagsInput = ref<string>(''); // Stores comma-separated health flags from the user
const registrationMessage = ref<string>(''); // For displaying success messages to the user

const authStore = useAuthStore(); // Get an instance of the authentication store

// Function to handle form submission for registration
const handleRegister = async () => {
  authStore.error = null; // Clear any previous errors from the store
  registrationMessage.value = ''; // Clear previous success messages

  // Perform client-side validation
  if (!email.value.trim()) {
    authStore.error = "Email is required.";
    return;
  }
  if (password.value !== confirmPassword.value) {
    authStore.error = "Passwords do not match.";
    return;
  }
  if (password.value.length < 6) {
    authStore.error = "Password must be at least 6 characters long.";
    return;
  }

  // Process health flags: convert comma-separated string into an array of trimmed, non-empty strings
  const flagsArray = healthFlagsInput.value
    .split(',')                  // Split the string by commas
    .map(flag => flag.trim())    // Remove leading/trailing whitespace from each flag
    .filter(flag => flag !== ''); // Remove any empty strings that might result (e.g., from multiple commas)

  // Call the register action from the authentication store
  const success = await authStore.register(email.value, password.value, flagsArray);

  if (success) {
    registrationMessage.value = "Account created successfully! You are now logged in.";
    // Optionally, clear the form fields after successful registration if not redirecting immediately
    // email.value = '';
    // password.value = '';
    // confirmPassword.value = '';
    // healthFlagsInput.value = '';
    // Navigation to the Home page is typically handled by the store action or router guards upon successful registration
  }
  // If registration is not successful, authStore.error will be set by the action and displayed by the template
};
</script>
