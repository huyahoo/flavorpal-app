<template>
  <div 
    id="flavorpal-app-container" 
    class="max-w-md mx-auto min-h-screen bg-flavorpal-gray-light font-sans overflow-x-hidden relative flex flex-col"
  >
    <main class="flex-grow overflow-y-auto" :class="{ 'pb-20': showBottomNavComputed }"> 
      <router-view v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <BottomNavigationBar v-if="showBottomNavComputed" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router'; // Import useRoute
import { useAuthStore } from './store/auth';
import BottomNavigationBar from './components/common/BottomNavigationBar.vue';

const authStore = useAuthStore();
const route = useRoute();

// Computed property to determine if the bottom navigation should be shown
const showBottomNavComputed = computed(() => {
  // 1. User must be authenticated
  // 2. The route's meta field 'showBottomNav' must not be explicitly false.
  //    If 'showBottomNav' is undefined in meta, we assume it should be shown for authenticated users.
  return authStore.isAuthenticated && route.meta.showBottomNav !== false;
});

onMounted(async () => { // Make onMounted async if initializeAuth is async
  // Ensure auth state is initialized, especially on page refresh or direct navigation
  if (!authStore.user && localStorage.getItem('flavorpal_current_user_v4')) {
    await authStore.initializeAuth();
  }
  // If authStore.initializeAuth() itself doesn't handle routing logic based on initial auth state,
  // you might need to add some here, but typically router guards and the init function cover it.
});
</script>

<style>
/* Global styles for body are in src/assets/main.css */
.page-fade-enter-active {
  transition: opacity 0.3s ease-out;
}
.page-fade-leave-active {
  transition: opacity 0.2s ease-in;
}
.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}
#flavorpal-app-container {
   box-shadow: 0 0 25px rgba(0,0,0,0.1);
}
</style>
