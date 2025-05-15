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

// Determine if the bottom navigation should be shown based on route meta
const showBottomNav = computed(() => {
  // Default to false if meta is not defined, or if explicitly set to false
  return route.meta.showBottomNav !== false && authStore.isAuthenticated;
});

onMounted(() => {
  authStore.initializeAuth();
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

/* Ensure the app container itself doesn't get an unwanted scrollbar if content is precisely screen height */
#flavorpal-app-container {
  /* Consider adding a subtle box-shadow here if not done by individual cards */
   box-shadow: 0 0 25px rgba(0,0,0,0.1);
}
</style>
