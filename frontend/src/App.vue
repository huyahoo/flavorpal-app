<template>
  <div
    id="flavorpal-app-container"
    class="max-w-md mx-auto h-dvh bg-flavorpal-gray-light font-sans overflow-hidden relative flex flex-col"
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

    <BadgePopupWrapper />
    <BottomNavigationBar v-if="showBottomNavComputed" />
    <IOSInstallPrompt />
    <AndroidInstallPrompt />
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from './store/auth';
import { useUiStore } from './store/uiStore';
import BottomNavigationBar from './components/common/BottomNavigationBar.vue';
import BadgePopupWrapper from './components/badges/BadgePopupWrapper.vue';
import IOSInstallPrompt from './components/pwaGuidance/IOSInstallPrompt.vue';
import AndroidInstallPrompt from './components/pwaGuidance/AndroidInstallPrompt.vue';

const authStore = useAuthStore();
const uiStore = useUiStore();
const route = useRoute();

const showBottomNavComputed = computed(() => {
  return authStore.isAuthenticated && route.meta.showBottomNav !== false  && 
  !uiStore.isCameraOverlayActive;;
});

onMounted(async () => { 
  if (!authStore.isAuthenticatedInitiallyChecked) {
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