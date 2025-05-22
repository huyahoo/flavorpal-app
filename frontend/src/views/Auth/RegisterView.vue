<template>
  <div class="flex flex-col items-center justify-center h-full bg-gradient-to-br from-flavorpal-green to-emerald-400 p-4 sm:p-6 antialiased">
    <div class="w-full max-w-md bg-white p-6 sm:p-10 rounded-2xl shadow-2xl transform transition-all hover:scale-105 duration-300 ease-in-out">
      <div class="text-center mb-8">
        <div class="inline-block p-3 bg-flavorpal-green rounded-full mb-4 shadow-lg">
          <img src="@/assets/flavorpal-logo.svg" alt="FlavorPal Logo" class="w-12 h-12" />
        </div>
        <h1 class="text-3xl font-bold text-flavorpal-gray-dark tracking-tight">Create Your Account</h1>
        <p class="text-flavorpal-gray mt-2 text-sm">Join FlavorPal and start your culinary adventure!</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-5">
        <div class="relative">
          <label for="nameRegister" class="block text-sm font-medium text-flavorpal-gray-dark mb-1">Name</label>
          <div class="relative rounded-lg shadow-sm">
             <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                </svg>
            </div>
            <input
              type="text"
              id="nameRegister"
              v-model="nameInput"
              required
              autocomplete="name"
              class="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-flavorpal-green focus:border-flavorpal-green sm:text-sm transition-shadow"
              placeholder="e.g., John"
            />
          </div>
        </div>

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
            placeholder="e.g., nuts, gluten-free, low sugar"
          />
        </div>

        <div v-if="authStore.error && !showSuccessModal" class="p-3 bg-red-50 border-l-4 border-red-400 text-red-700 text-sm rounded-md" role="alert">
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
    <footer class="text-center mt-8 pb-4"> <p class="text-xs text-emerald-100">&copy; {{ new Date().getFullYear() }} FlavorPal. Let's get tasting!</p>
    </footer>

    <NotificationModal
        :is-open="showSuccessModal"
        title="Registration Successful!"
        :message="successModalMessage"
        confirm-text="Proceed to Login"
        type="success"
        @confirm="proceedToLogin"
        @cancel="showSuccessModal = false" 
        :close-on-overlay-click="false" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../../store/auth';
import type { UserCreatePayload } from '../../types';
import { useRouter } from 'vue-router';
import NotificationModal from '@/components/common/NotificationModal.vue';

// Reactive variables for form inputs
const nameInput = ref<string>('');
const email = ref<string>('');
const password = ref<string>('');
const confirmPassword = ref<string>('');
const healthFlagsInput = ref<string>(''); 

const authStore = useAuthStore(); 
const router = useRouter();

// State for Notification Modal
const showSuccessModal = ref(false);
const successModalMessage = ref('');

// Function to handle form submission for registration
const handleRegister = async () => {
  authStore.error = null; 
  showSuccessModal.value = false;

  // Perform client-side validation
  if (!nameInput.value.trim()) {
    authStore.error = "Name is required.";
    return;
  }
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
    .split(',')                  
    .map(flag => flag.trim())    
    .filter(flag => flag !== ''); 

  // Construct the payload according to UserCreatePayload
  const payload: UserCreatePayload = {
    name: nameInput.value.trim(),
    email: email.value.trim(),
    password: password.value, // Password is sent plain, backend should hash it
    health_flags: flagsArray,
    badges: [], // Send empty array for badges; backend might assign some initially or handle this differently
  };

  console.log('Registering with payload:', payload); // For debugging

  const result = await authStore.register(payload); // authStore.register now returns { success, message }

  if (result.success) {
    successModalMessage.value = result.message || "Your account has been created successfully. Please proceed to login.";
    showSuccessModal.value = true; // Show the success modal
    // Clear form fields after showing modal, or when modal is confirmed
    nameInput.value = '';
    email.value = '';
    password.value = '';
    confirmPassword.value = '';
    healthFlagsInput.value = '';
  }
};

const proceedToLogin = () => {
    showSuccessModal.value = false;
    router.push({ name: 'Login' });
};
</script>

<style scoped>
</style>