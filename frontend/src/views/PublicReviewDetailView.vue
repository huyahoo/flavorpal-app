<template>
  <div class="flex flex-col min-h-full bg-flavorpal-gray-light">
    <header class="sticky top-0 z-30 bg-white p-4 shadow-sm flex items-center">
      <button @click="goBack" class="text-flavorpal-green hover:text-flavorpal-green-dark p-2 -ml-2 rounded-full" aria-label="Back">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
      </button>
      <h1 class="text-xl font-semibold text-flavorpal-gray-dark ml-2 truncate">Review Details</h1>
    </header>

    <main class="flex-grow p-4 sm:p-6 space-y-6 overflow-y-auto">
      <div v-if="discoverStore.isLoadingDetail && !review" class="text-center py-20">
        <svg class="animate-spin h-10 w-10 text-flavorpal-green mx-auto" viewBox="0 0 24 24">...</svg>
        <p class="mt-3 text-flavorpal-gray">Loading review...</p>
      </div>

      <div v-else-if="review" class="space-y-6">
        <section class="bg-white p-5 rounded-xl shadow-xl space-y-4">
          <div class="flex items-center space-x-3 border-b border-gray-100 pb-4">
            <img :src="review.reviewerAvatarUrl || defaultAvatar" :alt="`${review.reviewerUsername}'s avatar`" class="w-12 h-12 rounded-full object-cover bg-gray-200" onerror="this.src='https://placehold.co/48x48/E5E7EB/4B5563?text=??&font=roboto';"/>
            <div>
              <p class="font-semibold text-lg text-flavorpal-gray-dark">{{ review.reviewerUsername }}</p>
              <p class="text-xs text-gray-500">Reviewed on {{ formatDate(review.dateReviewed) }}</p>
            </div>
          </div>

          <div>
              <h2 class="text-2xl font-bold text-flavorpal-gray-dark mb-2">{{ review.productName }}</h2>
              <div v-if="review.productImageUrl" class="w-full aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden mb-3">
                  <img :src="review.productImageUrl" :alt="review.productName" class="w-full h-full object-contain" onerror="this.style.display='none'; this.parentElement.innerHTML = '<div class=\'w-full h-full flex items-center justify-center bg-gray-200 text-gray-400\'><svg class=\'w-16 h-16\' fill=\'none\' stroke=\'currentColor\' viewBox=\'0 0 24 24\'><path stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M4...Z\'></path></svg></div>';"/>
              </div>
              <StarRating :rating="review.userRating" starSize="w-6 h-6" class="mb-3"/>
          </div>

          <div>
              <h3 class="text-xl font-semibold text-flavorpal-gray-dark mb-2">Review Notes</h3>
              <p class="text-base text-flavorpal-gray leading-relaxed whitespace-pre-wrap">{{ review.userNotes }}</p>
          </div>

          <div class="pt-4 border-t border-gray-100 flex items-center">
            <button @click="toggleLike" class="flex items-center text-sm p-2 -ml-2 rounded-md transition-colors" :class="isLikedLocally ? 'text-flavorpal-orange hover:bg-flavorpal-orange-light/30' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'" :aria-pressed="isLikedLocally">
              <svg class="w-5 h-5 mr-1.5" :class="isLikedLocally ? 'fill-current' : 'fill-none'" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 ... Z"></path></svg>
              {{ localLikeCount }} Helpful
            </button>
          </div>
        </section>

        <section v-if="productInteractionDetails" class="bg-white p-5 rounded-xl shadow-lg">
            <h3 class="text-xl font-semibold text-flavorpal-gray-dark mb-2">Health Insights for {{ review.productName }}</h3>
            <p v-if="productInteractionDetails.aiHealthSummary" class="text-flavorpal-gray text-sm leading-relaxed mb-3">
                {{ productInteractionDetails.aiHealthSummary }}
            </p>
            <div v-if="productInteractionDetails.aiHealthConclusion" class="flex items-center">
                <span class="w-3 h-3 rounded-full mr-1.5 flex-shrink-0" :class="getAIConclusionColor(productInteractionDetails.aiHealthConclusion)" aria-hidden="true"></span>
                <span class="text-sm font-medium" :class="getAIConclusionTextColor(productInteractionDetails.aiHealthConclusion)">
                {{ getAIConclusionText(productInteractionDetails.aiHealthConclusion) }}
                </span>
            </div>
            <p v-else-if="!productInteractionDetails.aiHealthSummary" class="text-sm text-gray-500 italic">No specific health insights available for this product based on your profile.</p>
        </section>

        <section class="bg-white p-5 rounded-xl shadow-lg">
          <h3 class="text-xl font-semibold text-flavorpal-gray-dark mb-4">More Reviews for {{ review.productName }}</h3>
          <div v-if="discoverStore.isLoadingRelated" class="text-center py-4">
            <p class="text-sm text-flavorpal-gray animate-pulse">Loading related reviews...</p>
          </div>
          <div v-else-if="relatedReviews.length > 0" class="space-y-4">
            <SmallPublicReviewCard 
              v-for="relatedRev in relatedReviews" 
              :key="relatedRev.reviewId" 
              :review="relatedRev"
            />
          </div>
          <p v-else class="text-sm text-flavorpal-gray">No other reviews found for this product yet.</p>
        </section>
      </div>

      <div v-else-if="!discoverStore.isLoadingDetail && discoverStore.error" class="text-center py-10">
        <p class="text-red-500">{{ discoverStore.error }}</p>
        <button @click="goBack" class="mt-4 text-flavorpal-green hover:underline">Go Back</button>
      </div>
       <div v-else-if="!discoverStore.isLoadingDetail && !review" class="text-center py-10">
        <p class="text-flavorpal-gray-dark font-medium text-lg">Review not found.</p>
         <button @click="goBack" class="mt-4 text-flavorpal-green hover:underline">Go Back</button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDiscoverStore } from '../store/discoverStore';
import { useHistoryStore } from '../store/historyStore'; // To get product interaction details
import type { PublicReviewItem, Product, AiHealthConclusion } from '../types';
import StarRating from '@/components/common/StarRating.vue';
import SmallPublicReviewCard from '@/components/discover/SmallPublicReviewCard.vue'; // Import new component

const props = defineProps<{
  reviewId: string; 
}>();

const discoverStore = useDiscoverStore();
const historyStore = useHistoryStore(); // Instance of history store
const router = useRouter();

const review = computed(() => discoverStore.getCurrentReviewDetail);
const relatedReviews = computed(() => discoverStore.getRelatedPublicReviews);
const productInteractionDetails = ref<Product | null | undefined>(null); // To store AI insights

const defaultAvatar = 'https://placehold.co/48x48/E5E7EB/4B5563?text=??&font=roboto';

const localLikeCount = ref(0);
const isLikedLocally = ref(false); 

const loadData = async (currentReviewId: string) => {
    await discoverStore.loadSingleReviewDetail(currentReviewId);
    if (review.value) {
        localLikeCount.value = review.value.likeCount;
        // Fetch related reviews
        discoverStore.loadRelatedPublicReviews(review.value.productId, review.value.reviewId);
        // Fetch Product from historyStore for AI insights
        if (historyStore.allProductInteractions.length === 0 && !historyStore.loadingInteractions) {
            await historyStore.loadAllProducts();
        }
        productInteractionDetails.value = historyStore.getProductInteractionById(review.value.productId);
    }
};

onMounted(() => {
  loadData(props.reviewId);
});

// Watch for changes in reviewId prop if navigating between detail views
watch(() => props.reviewId, (newId) => {
    if (newId) {
        loadData(newId);
    }
});

const formatDate = (dateString: string) => { /* ... as before ... */ 
    try { return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch(e) { return dateString; }
};
const toggleLike = () => { /* ... as before ... */ 
    if (!review.value) return;
    if (isLikedLocally.value) { localLikeCount.value--; } else { localLikeCount.value++; }
    isLikedLocally.value = !isLikedLocally.value;
    discoverStore.likeReview(props.reviewId);
};
const goBack = () => { /* ... as before ... */ 
    if (window.history.state.back) { router.go(-1); } else { router.push({ name: 'Discover' }); }
};

// AI Conclusion Styling Helpers (can be moved to a utility file)
const getAIConclusionColor = (conclusion?: AiHealthConclusion): string => {
    switch (conclusion) {
        case 'good': return 'bg-flavorpal-green';
        case 'caution': return 'bg-yellow-400';
        case 'avoid': return 'bg-red-500';
        case 'info_needed': return 'bg-blue-400';
        case 'error_analyzing': return 'bg-purple-500';
        case 'neutral': default: return 'bg-gray-400';
    }
};
const getAIConclusionTextColor = (conclusion?: AiHealthConclusion): string => {
    switch (conclusion) {
        case 'good': return 'text-flavorpal-green-dark';
        case 'caution': return 'text-yellow-600';
        case 'avoid': return 'text-red-700';
        case 'info_needed': return 'text-blue-600';
        case 'error_analyzing': return 'text-purple-700';
        case 'neutral': default: return 'text-gray-600';
    }
};
const getAIConclusionText = (conclusion?: AiHealthConclusion): string => {
    switch (conclusion) {
        case 'good': return 'Looks good for you';
        case 'caution': return 'Use with caution';
        case 'avoid': return 'Best to avoid';
        case 'info_needed': return 'More info needed';
        case 'error_analyzing': return 'Analysis Error';
        case 'neutral': return 'Neutral';
        default: return 'Analysis pending';
    }
};
</script>

<style scoped>
.whitespace-pre-wrap { white-space: pre-wrap; }
.aspect-\[16\/9\] { aspect-ratio: 16 / 9; }
</style>