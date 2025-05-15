<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold text-flavorpal-gray-dark">My Account</h1>
    <div v-if="authStore.user" class="mt-4 space-y-2">
      <p><strong class="text-flavorpal-gray-dark">Email:</strong> {{ authStore.user.email }}</p>
      <p><strong class="text-flavorpal-gray-dark">Health Flags:</strong> {{ authStore.healthFlags.join(', ') || 'Not set' }}</p>
       <button
        @click="handleLogout"
        class="mt-6 w-full bg-flavorpal-orange hover:bg-flavorpal-orange-dark text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-colors duration-150 ease-in-out shadow hover:shadow-md"
      >
        Logout
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../store/auth';
const authStore = useAuthStore();

const handleLogout = async () => {
  await authStore.logout();
};
</script>
