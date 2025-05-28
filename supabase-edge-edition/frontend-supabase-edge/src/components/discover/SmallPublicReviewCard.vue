<template>
  <article
    class="bg-gray-50 p-3 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out cursor-pointer flex space-x-3"
    @click="navigateToDetail"
    role="article"
    :aria-labelledby="`relatedProductName-${review.reviewId}`"
    tabindex="0"
    @keypress.enter="navigateToDetail"
  >
    <div class="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
      <img 
        v-if="review.productImageUrl" 
        :src="review.productImageUrl" 
        :alt="review.productName" 
        class="w-full h-full object-contain"
        onerror="this.style.display='none'; this.nextSibling.style.display='flex';"
        loading="lazy"
      />
      <img 
        v-else-if="review.reviewerAvatarUrl" 
        :src="review.reviewerAvatarUrl" 
        :alt="review.reviewerUsername" 
        class="w-full h-full object-cover"
        onerror="this.style.display='none'; this.nextSibling.style.display='flex';"
        loading="lazy"
      />
      <svg 
        v-else 
        class="w-8 h-8 text-gray-400" 
        style="display:flex;"
        fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
    </div>

    <div class="flex-grow min-w-0">
      <h4 :id="`relatedProductName-${review.reviewId}`" class="font-semibold text-sm text-flavorpal-gray-dark truncate" :title="review.productName">
        {{ review.productName }}
      </h4>
      <p class="text-xs text-gray-500 truncate mb-0.5">
        Reviewed by <span class="font-medium">{{ review.reviewerUsername }}</span>
      </p>
      <StarRating :rating="review.userRating" starSize="w-3 h-3" class="mb-1"/>
      <p class="text-xs text-flavorpal-gray line-clamp-2">
        {{ review.userNotes }}
      </p>
      <!-- <div class="mt-1 text-xs text-gray-400 flex items-center">
        <svg class="w-3 h-3 mr-1 fill-current text-gray-400" viewBox="0 0 24 24"><path d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path></svg>
        {{ review.likeCount }}
      </div> -->
    </div>
  </article>
</template>

<script setup lang="ts">
import type { PublicReviewItem } from '../../types';
import StarRating from '@/components/common/StarRating.vue';
import { useRouter } from 'vue-router';

const props = defineProps<{
  review: PublicReviewItem;
}>();

const router = useRouter();

const navigateToDetail = () => {
  router.push({ name: 'PublicReviewDetail', params: { reviewId: props.review.reviewId } });
};
</script>

<style scoped>
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>