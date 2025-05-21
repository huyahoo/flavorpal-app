<template>
  <article 
    class="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col cursor-pointer hover:shadow-xl transition-shadow duration-200 ease-in-out"
    @click="navigateToDetail"
    role="article"
    :aria-labelledby="`productName-${review.reviewId}`"
    tabindex="0"
    @keypress.enter="navigateToDetail"
  >
    <div class="p-4 flex items-center space-x-3 border-b border-gray-100">
      <img 
        :src="review.reviewerAvatarUrl || defaultAvatar" 
        :alt="`${review.reviewerUsername}'s avatar`" 
        class="w-10 h-10 rounded-full object-cover bg-gray-200"
        onerror="this.src='https://placehold.co/40x40/E5E7EB/4B5563?text=??&font=roboto';"
      />
      <div>
        <p class="font-semibold text-sm text-flavorpal-gray-dark">{{ review.reviewerUsername }}</p>
        <p class="text-xs text-gray-500">{{ formatDate(review.dateReviewed) }}</p>
      </div>
    </div>

    <div v-if="review.productImageUrl" class="w-full aspect-[16/9] bg-gray-100 overflow-hidden">
      <img 
        :src="review.productImageUrl" 
        :alt="review.productName" 
        class="w-full h-full object-contain"
        loading="lazy"
        onerror="this.style.display='none'; this.parentElement.innerHTML = '<div class=\'w-full h-full flex items-center justify-center bg-gray-200 text-gray-400\'><svg class=\'w-10 h-10\' fill=\'none\' stroke=\'currentColor\' viewBox=\'0 0 24 24\'><path stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z\'></path></svg></div>';"
      />
    </div>
     <div v-else class="w-full aspect-[16/9] bg-gray-200 flex items-center justify-center text-gray-400">
        <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
    </div>


    <div class="p-4 flex-grow flex flex-col">
      <h3 :id="`productName-${review.reviewId}`" class="text-lg font-semibold text-flavorpal-gray-dark mb-1 truncate" :title="review.productName">
        {{ review.productName }}
      </h3>
      <StarRating :rating="review.userRating" starSize="w-4 h-4 sm:w-5 sm:h-5" class="mb-2"/>
      <p class="text-sm text-flavorpal-gray line-clamp-3 mb-3 flex-grow">
        {{ review.userNotes }}
      </p>

      <div class="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
        <button 
          @click.stop="toggleLike" 
          class="flex items-center text-sm p-2 -ml-2 rounded-md transition-colors"
          :class="isLikedLocally ? 'text-flavorpal-orange hover:bg-flavorpal-orange-light/30' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'"
          :aria-pressed="isLikedLocally"
          aria-label="Like this review"
        >
          <svg class="w-5 h-5 mr-1.5" :class="isLikedLocally ? 'fill-current' : 'fill-none'" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
          </svg>
          {{ localLikeCount }} 
          <span class="hidden sm:inline ml-1">{{ localLikeCount === 1 ? 'person' : 'people' }} found this helpful</span>
        </button>
        </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { PublicReviewItem } from '../../types';
import StarRating from '@/components/common/StarRating.vue'; // Assuming StarRating.vue is in common
import { useDiscoverStore } from '../../store/discoverStore';
import { useRouter } from 'vue-router';

const props = defineProps<{
  review: PublicReviewItem;
}>();

const discoverStore = useDiscoverStore();
const router = useRouter();

// Local state for optimistic like updates
const localLikeCount = ref(props.review.likeCount);
const isLikedLocally = ref(false); // In a real app, this would come from user's liked items state

const defaultAvatar = 'https://placehold.co/40x40/E5E7EB/4B5563?text=??&font=roboto';

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (e) {
    return dateString; // Fallback
  }
};

const toggleLike = () => {
  // For MVP, just toggle locally and call store action (which is also mock)
  if (isLikedLocally.value) {
    localLikeCount.value--;
  } else {
    localLikeCount.value++;
  }
  isLikedLocally.value = !isLikedLocally.value;
  discoverStore.likeReview(props.review.reviewId); // This is an optimistic update
};

const navigateToDetail = () => {
  router.push({ name: 'PublicReviewDetail', params: { reviewId: props.review.reviewId } });
};

onMounted(() => {
    // In a real app, you might check if the current user has already liked this review
    // and set isLikedLocally accordingly.
});
</script>

<style scoped>
.line-clamp-3 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
.aspect-\[16\/9\] {
    aspect-ratio: 16 / 9;
}
</style>
