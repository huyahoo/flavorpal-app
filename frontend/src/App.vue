<template>
  <div 
    id="flavorpal-app-container" 
    class="max-w-md mx-auto min-h-screen bg-flavorpal-gray-light font-sans overflow-hidden relative flex flex-col"
    :style="{ 
      paddingTop: 'env(safe-area-inset-top)', 
      paddingBottom: !showBottomNavComputed ? 'env(safe-area-inset-bottom)' : '0px' 
    }"
  >
    <main 
      class="flex-grow overflow-y-auto" 
      :class="{ 'pb-20': showBottomNavComputed }" 
    > 
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
import { useRoute } from 'vue-router';
import { useAuthStore } from './store/auth';
import BottomNavigationBar from './components/common/BottomNavigationBar.vue';

const authStore = useAuthStore();
const route = useRoute();

const showBottomNavComputed = computed(() => {
  return authStore.isAuthenticated && route.meta.showBottomNav !== false;
});

onMounted(async () => { 
  if (!authStore.user && localStorage.getItem('flavorpal_current_user_v4')) {
    await authStore.initializeAuth();
  }
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
