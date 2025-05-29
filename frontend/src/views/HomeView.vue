<template>
  <div class="flex flex-col min-h-full bg-flavorpal-gray-light">
    <header class="bg-flavorpal-green text-white p-6 pt-8 sm:p-8 rounded-b-3xl shadow-lg">
      <div class="text-center">
        <p v-if="authStore.currentUsername" class="text-lg opacity-90">
          {{ authStore.currentUsername }}, you have discovered
        </p>
        <p v-else class="text-lg opacity-90">You have discovered</p>
        
        <div v-if="historyStore.loadingStats" class="my-3 text-7xl font-bold tracking-tighter animate-pulse">--</div>
        <div v-else class="my-3">
          <span class="text-7xl sm:text-8xl font-bold tracking-tighter">{{ historyStore.discoveredThisMonth }}</span>
        </div>
        
        <p class="text-base opacity-90 leading-tight">
          new products this month,
          <br />from scanning a total of
        </p>
        
        <div v-if="historyStore.loadingStats" class="my-2 text-4xl font-semibold animate-pulse">--</div>
        <div v-else class="my-1 sm:my-2">
          <span class="text-4xl sm:text-5xl font-semibold">{{ historyStore.totalScanned }}</span>
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
            aria-label="View all scanned items"
          >
            See All
          </button>
        </div>

        <div v-if="historyStore.loadingInteractions && recentlyScannedItems.length === 0" class="text-center py-6">
          <svg class="animate-spin h-8 w-8 text-flavorpal-green mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-sm text-flavorpal-gray">Loading recent scans...</p>
        </div>
        <div v-else-if="recentlyScannedItems.length > 0" class="space-y-4">
          <ScannedItemCard
            v-for="item in recentlyScannedItems"
            :key="item.id"
            :item="item" 
          />
        </div>
        <div v-else-if="!historyStore.loadingInteractions && recentlyScannedItems.length === 0" class="text-center py-8">
          <svg class="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
          <p class="text-flavorpal-gray font-medium">No recently scanned items.</p>
          <p class="text-sm text-flavorpal-gray mt-1">Start scanning products to see them here!</p>
        </div>
         <p v-if="historyStore.error && !historyStore.loadingInteractions" class="text-xs text-red-500 mt-2 text-center">
            Could not load recent scans.
        </p>
      </section>

      <section class="bg-white p-5 rounded-xl shadow-xl">
        <h2 class="text-xl font-semibold text-flavorpal-gray-dark mb-4">Discover New Flavors</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="bg-flavorpal-orange-light p-4 rounded-lg text-center hover:shadow-md transition-shadow cursor-pointer" @click="navigateToTrendingSnacks">
            <p class="font-semibold text-flavorpal-orange-dark">Trending Snacks</p>
            <p class="text-xs text-flavorpal-orange-dark opacity-80 mt-1">Find what's popular!</p>
          </div>
          <div class="bg-flavorpal-green-light p-4 rounded-lg text-center hover:shadow-md transition-shadow cursor-pointer" @click="navigateToLocalDelicacies">
            <p class="font-semibold text-flavorpal-green-dark">Local Delicacies</p>
            <p class="text-xs text-flavorpal-green-dark opacity-80 mt-1">Explore regional tastes.</p>
          </div>
        </div>
      </section>
    </main>
    <UpcomingFeatureModal
      :is-open="isUpcomingModalOpen"
      :feature-name="upcomingFeatureName"
      @close="isUpcomingModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useAuthStore } from '../store/auth';
import { useHistoryStore } from '../store/historyStore'; // Import the history store
import ScannedItemCard from '@/components/home/ScannedItemCard.vue'; 
import { useRouter } from 'vue-router';
import UpcomingFeatureModal from '@/components/common/UpcomingFeatureModal.vue';

const authStore = useAuthStore();
const historyStore = useHistoryStore(); // Use history store
const router = useRouter();

const isUpcomingModalOpen = ref(false);
const upcomingFeatureName = ref('');

// Get a limited number of recent scans from historyStore
const recentlyScannedItems = computed(() => historyStore.getRecentlyScannedItems(3)); // Show 3 items

const navigateToFullScanHistory = () => {
  historyStore.setInitialHistoryFilters('scanned_only'); // Or 'all' if preferred for "See All" from home
  router.push({ name: 'History' });
};

onMounted(async () => {
  if (!authStore.user && localStorage.getItem('flavorpal_current_user_v4')) {
    await authStore.initializeAuth();
  }
  
  if (authStore.isAuthenticated) {
    // Load both interactions (for recent scans) and stats
    Promise.all([
        historyStore.loadProductInteractions(), // This will populate allProductInteractions
        historyStore.loadScanStatistics()      // This will populate stats
    ]).catch(error => {
        console.error("Error loading home page data (history/stats):", error);
    });
  }
});

const showUpcomingFeatureModal = (feature: string) => {
  upcomingFeatureName.value = feature;
  isUpcomingModalOpen.value = true;
};

const navigateToTrendingSnacks = () => {
  showUpcomingFeatureModal('Trending Snacks');
};

const navigateToLocalDelicacies = () => {
  showUpcomingFeatureModal('Local Delicacies');
};

</script>

<style scoped>
/* Scoped styles for HomeView if any additional are needed */
</style>
