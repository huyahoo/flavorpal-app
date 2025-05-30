<template>
  <div class="flex flex-col min-h-full bg-flavorpal-gray-light">
    <header class="sticky top-0 z-30 bg-white pt-6 pb-3 px-4 sm:px-6 shadow-sm text-center">
      <h1 class="text-xl sm:text-2xl font-bold text-flavorpal-gray-dark">Discover Reviews</h1>
    </header>

    <main class="flex-grow p-4 sm:p-6 space-y-5 overflow-y-auto">
      <div v-if="discoverStore.isLoading && discoverStore.publicReviews.length === 0" class="text-center py-10">
        <svg class="animate-spin h-10 w-10 text-flavorpal-green mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="mt-3 text-flavorpal-gray">Loading reviews...</p>
      </div>

      <div v-else-if="discoverStore.publicReviews.length > 0" class="space-y-5">
        <PublicReviewCard 
          v-for="review in discoverStore.publicReviews" 
          :key="review.reviewId" 
          :review="review"
        />
        <div v-if="discoverStore.hasMoreReviews && !discoverStore.isLoadingMore" class="mt-6 text-center">
          <button 
            @click="loadMoreReviews"
            class="bg-flavorpal-green hover:bg-flavorpal-green-dark text-white font-semibold py-2.5 px-6 rounded-lg transition-colors shadow-md"
          >
            Load More Reviews
          </button>
        </div>
        <div v-if="discoverStore.isLoadingMore" class="text-center py-4">
          <svg class="animate-spin h-6 w-6 text-flavorpal-green mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
         <p v-if="!discoverStore.hasMoreReviews && discoverStore.publicReviews.length > 0" class="text-center text-sm text-gray-500 py-4">
            You've reached the end of the reviews!
        </p>
      </div>

      <div v-else-if="!discoverStore.isLoading && discoverStore.publicReviews.length === 0" class="text-center py-10">
        <svg class="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
        <p class="text-flavorpal-gray-dark font-medium text-lg">No public reviews available yet.</p>
        <p class="text-flavorpal-gray mt-1 text-sm">Be the first to share your flavor discoveries!</p>
      </div>

      <p v-if="discoverStore.error && !discoverStore.isLoading" class="text-center text-red-500 py-4">
        {{ discoverStore.error }}
      </p>
    </main>

    <UpcomingFeatureModal
      v-if="isUpcomingModalOpen"
      :isOpen="isUpcomingModalOpen"
      :featureName="upcomingFeatureName"
      @close="isUpcomingModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useDiscoverStore } from '../store/discoverStore';
import PublicReviewCard from '@/components/discover/PublicReviewCard.vue';
import UpcomingFeatureModal from '@/components/common/UpcomingFeatureModal.vue';

const discoverStore = useDiscoverStore();

const isUpcomingModalOpen = ref(false);
const upcomingFeatureName = ref('');

const showUpcomingFeatureModal = (feature: string) => {
  upcomingFeatureName.value = feature;
  isUpcomingModalOpen.value = true;
};
onMounted(() => {
  // Load initial set of reviews if the list is empty
  if (discoverStore.publicReviews.length === 0) {
    discoverStore.loadPublicReviews(true); // Pass true for forceRefresh on initial load
  }

  setTimeout(() => {
    showUpcomingFeatureModal('Discover');
  }, 500);
});

const loadMoreReviews = () => {
  discoverStore.loadPublicReviews();
};
</script>

<style scoped>
</style>