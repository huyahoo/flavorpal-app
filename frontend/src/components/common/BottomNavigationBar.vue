<template>
  <nav class="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 shadow-top-nav z-50">
    <div class="flex justify-around items-center h-18 sm:h-20"> 
      <router-link
        to="/"
        class="flex flex-col items-center justify-center text-center px-2 py-1 flex-1 group"
        :class="isActive('/') ? 'text-flavorpal-green' : 'text-flavorpal-gray hover:text-flavorpal-green-dark'"
        @click="handleNavigation('/')"
      >
        <svg class="w-6 h-6 mb-0.5 transition-transform duration-200 ease-in-out group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
        <span class="text-xs font-medium tracking-tight">Overview</span>
      </router-link>

      <router-link
        to="/history"
        class="flex flex-col items-center justify-center text-center px-2 py-1 flex-1 group"
        :class="isActive('/history') ? 'text-flavorpal-green' : 'text-flavorpal-gray hover:text-flavorpal-green-dark'"
        @click="handleNavigation('/history')"
      >
        <svg class="w-6 h-6 mb-0.5 transition-transform duration-200 ease-in-out group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <span class="text-xs font-medium tracking-tight">History</span>
      </router-link>

      <div class="flex-1 flex justify-center items-center flex-col pb-1"> 
        <router-link
          to="/scan"
          class="flex flex-col items-center justify-center text-center transform transition-transform duration-200 ease-in-out hover:scale-105 active:scale-100"
          style="margin-top: -1.75rem;"
          @click="handleNavigation('/scan')"
          aria-label="Scan Product"
        >
          <div class="bg-flavorpal-green text-white rounded-full p-3.5 sm:p-4 shadow-lg ring-4 ring-white dark:ring-gray-50">
            <svg class="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          </div>
          <span 
            class="text-xs font-medium tracking-tight mt-1.5" 
            :class="isActive('/scan') ? 'text-flavorpal-green' : 'text-flavorpal-gray'"
          >
            Scan
          </span>
        </router-link>
      </div>

      <router-link
        to="/discover"
        class="flex flex-col items-center justify-center text-center px-2 py-1 flex-1 group"
        :class="isActive('/discover') ? 'text-flavorpal-green' : 'text-flavorpal-gray hover:text-flavorpal-green-dark'"
        @click="handleNavigation('/discover')"
      >
        <svg class="w-6 h-6 mb-0.5 transition-transform duration-200 ease-in-out group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.846 5.661a1 1 0 00.95.69h5.942c.969 0 1.371 1.24.588 1.81l-4.803 3.484a1 1 0 00-.364 1.118l1.846 5.661c.3.921-.755 1.688-1.54 1.118l-4.803-3.484a1 1 0 00-1.175 0l-4.803 3.484c-.784.57-1.838-.197-1.539-1.118l1.846-5.661a1 1 0 00-.364-1.118L2.28 11.088c-.783-.57-.38-1.81.588-1.81h5.942a1 1 0 00.95-.69L11.049 2.927z"></path></svg>
        <span class="text-xs font-medium tracking-tight">Discover</span>
      </router-link>

      <router-link
        to="/account"
        class="flex flex-col items-center justify-center text-center px-2 py-1 flex-1 group"
        :class="isActive('/account') ? 'text-flavorpal-green' : 'text-flavorpal-gray hover:text-flavorpal-green-dark'"
        @click="handleNavigation('/account')"
      >
        <svg class="w-6 h-6 mb-0.5 transition-transform duration-200 ease-in-out group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
        <span class="text-xs font-medium tracking-tight">Account</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute(); // Get current route information
const router = useRouter(); // Get router instance for programmatic navigation

// Reactive variable to keep track of the currently active tab's path
const activeTab = ref(route.path);

// Watch for changes in the route path (e.g., when user navigates)
// and update the activeTab accordingly.
watch(() => route.path, (newPath) => {
  activeTab.value = newPath;
});

// Function to determine if a given navigation path is currently active.
// This is used to apply active styling (e.g., text color) to the navigation items.
const isActive = (path: string): boolean => {
  // For the home tab ('/'), it's active if the path is exactly '/' or starts with '/?' (to handle query parameters).
  if (path === '/') {
    return activeTab.value === '/' || activeTab.value.startsWith('/?');
  }
  // For other tabs, it's active if the current route's path starts with the tab's path.
  // This allows for nested routes under a main tab to still highlight the parent tab.
  // Example: If current path is '/account/profile', the '/account' tab will be considered active.
  return activeTab.value.startsWith(path);
};

// Handles navigation and updates the active tab state.
// While <router-link> handles navigation, this function ensures activeTab is updated
// immediately on click, which can be useful for more complex scenarios or if
// we wanted to add other logic on tab click. For simple cases, it might seem redundant
// with the watcher, but it ensures immediate visual feedback if needed.
const handleNavigation = (path: string) => {
  // Note: <router-link> will handle the actual navigation.
  // This click handler is mostly for explicitly setting the activeTab if needed,
  // though the watcher on route.path is the primary mechanism for keeping it in sync.
  // For this setup, it's somewhat optional but doesn't hurt.
  // activeTab.value = path; // Can be set here, or rely on watcher
};
</script>

<style scoped>
/* Custom shadow for the top of the navigation bar to give it a slight "lifted" appearance. */
.shadow-top-nav {
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.05); /* Subtle shadow on the top edge */
}

/* Additional styling for the prominent scan button's ring, if needed */
.dark\:ring-gray-50 {
    /* Example for dark mode, if you implement it */
}
</style>
