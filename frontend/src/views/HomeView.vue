<template>
  <div class="flex flex-col min-h-full bg-flavorpal-gray-light">
    <header class="bg-flavorpal-green text-white p-6 pt-8 sm:p-8 rounded-b-3xl shadow-lg">
      <div class="text-center">
        <p v-if="authStore.currentUsername" class="text-lg opacity-90">
          {{ authStore.currentUsername }}, you have discovered
        </p>
        <p v-else class="text-lg opacity-90">You have discovered</p>
        
        <div v-if="scannedProductsStore.loadingStats" class="my-3 text-7xl font-bold tracking-tighter animate-pulse">--</div>
        <div v-else class="my-3">
          <span class="text-7xl sm:text-8xl font-bold tracking-tighter">{{ scannedProductsStore.discoveredThisMonth }}</span>
        </div>
        
        <p class="text-base opacity-90 leading-tight">
          new products this month,
          <br />from scanning a total of
        </p>
        
        <div v-if="scannedProductsStore.loadingStats" class="my-2 text-4xl font-semibold animate-pulse">--</div>
        <div v-else class="my-1 sm:my-2">
          <span class="text-4xl sm:text-5xl font-semibold">{{ scannedProductsStore.totalScanned }}</span>
          <span class="text-3xl sm:text-4xl font-light opacity-80 ml-1">products</span>
        </div>
      </div>
    </header>

    <main class="flex-grow p-4 sm:p-6 -mt-8 z-10">
      <section class="bg-white p-5 rounded-xl shadow-xl mb-8">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-flavorpal-gray-dark">Recently Scanned</h2>
          <button
            @click="navigateToFullScanHistory"
            class="text-sm text-flavorpal-green hover:text-flavorpal-green-dark font-medium transition-colors"
            aria-label="View all recently scanned items"
          >
            See All
          </button>
        </div>

        <div v-if="scannedProductsStore.loadingScans" class="text-center py-6">
          <svg class="animate-spin h-8 w-8 text-flavorpal-green mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-sm text-flavorpal-gray">Loading recent scans...</p>
        </div>
        <div v-else-if="summaryRecentScans.length > 0" class="space-y-4">
          <ScannedItemCard
            v-for="item in summaryRecentScans"
            :key="item.id"
            :item="item"
          />
        </div>
        <div v-else-if="!scannedProductsStore.loadingScans && summaryRecentScans.length === 0" class="text-center py-8">
          <svg class="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
          <p class="text-flavorpal-gray font-medium">No recently scanned items.</p>
          <p class="text-sm text-flavorpal-gray mt-1">Start scanning products to see them here!</p>
        </div>
         <p v-if="scannedProductsStore.error && !scannedProductsStore.loadingScans" class="text-xs text-red-500 mt-2 text-center">
            Could not load recent scans.
        </p>
      </section>

      <section class="bg-white p-5 rounded-xl shadow-xl">
        <h2 class="text-xl font-semibold text-flavorpal-gray-dark mb-4">Discover New Flavors</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="bg-flavorpal-orange-light p-4 rounded-lg text-center hover:shadow-md transition-shadow cursor-pointer">
            <p class="font-semibold text-flavorpal-orange-dark">Trending Snacks</p>
            <p class="text-xs text-flavorpal-orange-dark opacity-80 mt-1">Find what's popular!</p>
          </div>
          <div class="bg-flavorpal-green-light p-4 rounded-lg text-center hover:shadow-md transition-shadow cursor-pointer">
            <p class="font-semibold text-flavorpal-green-dark">Local Delicacies</p>
            <p class="text-xs text-flavorpal-green-dark opacity-80 mt-1">Explore regional tastes.</p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useAuthStore } from '../store/auth';
import { useScannedProductsStore } from '../store/scannedProductsStore';
import { useHistoryStore } from '../store/historyStore'; // Import the history store
import ScannedItemCard from '@/components/home/ScannedItemCard.vue';
import { useRouter } from 'vue-router'; // Import Vue Router

const authStore = useAuthStore();
const scannedProductsStore = useScannedProductsStore();
const historyStore = useHistoryStore(); // Get an instance of the history store
const router = useRouter(); // Get an instance of the router

// Get a limited number of recent scans for the home page summary
const summaryRecentScans = computed(() => scannedProductsStore.getSummaryRecentScans(3));

// Function to handle navigation to the full scan history
const navigateToFullScanHistory = () => {
  // Set the initial filter in the history store to show only "scanned_only" items
  historyStore.setInitialHistoryFilters('scanned_only');
  // Navigate to the History page
  router.push({ name: 'History' });
};

// Fetch data when the component is mounted
onMounted(async () => {
  if (!authStore.user && localStorage.getItem('flavorpal_current_user_v4')) {
    await authStore.initializeAuth();
  }
  
  if (authStore.isAuthenticated) {
    Promise.all([
        scannedProductsStore.loadRecentScans(),
        scannedProductsStore.loadScanStatistics()
    ]).catch(error => {
        console.error("Error loading home page data:", error);
    });
  }
});
</script>

<style scoped>
/* Scoped styles for HomeView if any additional are needed */
</style>
