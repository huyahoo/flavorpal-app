<template>
  <div class="flex flex-col min-h-full bg-flavorpal-gray-light">
    <header class="sticky top-0 z-30 bg-white p-4 shadow-sm flex items-center">
      <button @click="goBack" class="text-flavorpal-green hover:text-flavorpal-green-dark p-2 -ml-2 rounded-full" aria-label="Go back to previous page">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
      </button>
      <h1 class="text-xl font-semibold text-flavorpal-gray-dark ml-2">
        {{ reviewData.isReviewed ? 'Edit Review' : 'Create Review' }}
      </h1>
    </header>

    <div class="px-4 sm:px-6 pt-4">
        <div class="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div class="bg-flavorpal-green h-2.5 rounded-full transition-all duration-300 ease-out" :style="{ width: progressPercentage + '%' }"></div>
        </div>
        <p class="text-xs text-center text-flavorpal-gray">Step {{ currentStep }} of {{ totalSteps }}</p>
    </div>

    <main class="flex-grow p-4 sm:p-6">
      <form @submit.prevent="handleNextOrSubmit" class="space-y-8 bg-white p-5 rounded-xl shadow-lg">
        <div v-if="currentStep === 1" class="animate-fade-in">
          <h2 class="text-lg font-semibold text-flavorpal-gray-dark mb-1">What's the name of this product?</h2>
          <p class="text-sm text-flavorpal-gray mb-4">Enter the full product name as it appears on the packaging.</p>
          <div>
            <label for="name" class="sr-only">Product Name</label>
            <input
              type="text"
              id="name"
              v-model="reviewData.name"
              class="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-flavorpal-green focus:border-flavorpal-green sm:text-base"
              placeholder="e.g., Organic Almond Milk"
              required
              disabled
              ref="productNameInputRef"
            />
          </div>
        </div>

        <div v-if="currentStep === 2" class="animate-fade-in">
          <h2 class="text-lg font-semibold text-flavorpal-gray-dark mb-1">Give your rating for "{{ reviewData.name || 'this product' }}"</h2>
          <p class="text-sm text-flavorpal-gray mb-4">How would you rate it out of 5 stars?</p>
          <div class="flex justify-center">
            <StarRatingInput v-model="reviewData.rating" starSize="w-10 h-10 sm:w-12 sm:h-12" />
          </div>
           <p v-if="reviewData.rating === 0 && currentStep === 2 && triedToSubmitStep2" class="text-xs text-center text-red-500 mt-2">Please select a rating.</p>
        </div>

        <div v-if="currentStep === 3" class="animate-fade-in">
          <h2 class="text-lg font-semibold text-flavorpal-gray-dark mb-1">Write a short review for "{{ reviewData.name || 'this product' }}"</h2>
          <p class="text-sm text-flavorpal-gray mb-4">Share your thoughts on taste, texture, price, or if you'd buy it again.</p>
          <div>
            <label for="userNotes" class="sr-only">Your Review Notes</label>
            <textarea
              id="userNotes"
              v-model="reviewData.note"
              rows="6"
              class="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-flavorpal-green focus:border-flavorpal-green sm:text-sm"
              placeholder="Write your review here..."
            ></textarea>
          </div>
        </div>

        <div v-if="currentStep === 4" class="animate-fade-in">
          <h2 class="text-lg font-semibold text-flavorpal-gray-dark mb-3 text-center">Almost there!</h2>
          <div v-if="productToReview?.aiHealthConclusion && productToReview.aiHealthConclusion !== 'ok'"
               class="p-3 mb-4 rounded-md border"
               :class="{
                    'bg-yellow-50 border-yellow-400 text-yellow-700': productToReview.aiHealthConclusion === 'neutral',
                    'bg-red-50 border-red-400 text-red-700': productToReview.aiHealthConclusion === 'avoid',
                    'bg-blue-50 border-blue-400 text-blue-700': productToReview.aiHealthConclusion === 'unknown',
               }">
            <div class="flex items-center">
                <svg v-if="productToReview.aiHealthConclusion === 'neutral'" class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" /></svg>
                <svg v-if="productToReview.aiHealthConclusion === 'avoid'" class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" /></svg>
                <svg v-if="productToReview.aiHealthConclusion === 'unknown'" class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" /></svg>
                <p class="text-sm font-medium">
                    <strong class="capitalize">{{ productToReview.aiHealthConclusion }}:</strong>
                    {{ productToReview.aiHealthSummary || "Please review product ingredients based on your health profile." }}
                </p>
            </div>
          </div>
          <p v-else class="text-sm text-flavorpal-gray text-center mb-4">
            You're about to {{ reviewData.isReviewed ? 'update' : 'add' }} your review for "{{ reviewData.name }}".
          </p>
        </div>

        <div class="flex pt-4" :class="currentStep === 1 ? 'justify-end' : 'justify-between'">
          <button
            v-if="currentStep > 1"
            type="button"
            @click="prevStep"
            class="px-5 py-2.5 text-sm font-medium text-flavorpal-gray-dark bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            &lt; PREV
          </button>
          <button
            type="submit"
            :disabled="isNextDisabled"
            class="px-5 py-2.5 text-sm font-medium text-white bg-flavorpal-green hover:bg-flavorpal-green-dark rounded-lg transition-colors disabled:opacity-60"
          >
            {{ currentStep === totalSteps ? (reviewData.isReviewed ? 'UPDATE REVIEW' : 'DONE') : 'NEXT >' }}
          </button>
        </div>
         <p v-if="historyStore.loadingInteractions" class="text-xs text-center text-flavorpal-gray animate-pulse mt-2">Saving review...</p>
         <p v-if="historyStore.error" class="text-xs text-center text-red-500 mt-2">{{ historyStore.error }}</p>
      </form>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useHistoryStore } from '../store/historyStore';
import type { BadgeStatistic, ProductInteraction, ReViewDataPayload } from '../types';
import StarRatingInput from '@/components/common/StarRatingInput.vue';
import { useBadgeStore } from '@/store/badgeStore';

const route = useRoute();
const router = useRouter();
const historyStore = useHistoryStore();
const badgeStore = useBadgeStore();

const currentStep = ref(1);
const totalSteps = 4; // Product Name, Rating, Notes, Confirmation

const productNameInputRef = ref<HTMLInputElement | null>(null);
const triedToSubmitStep2 = ref(false); // To show rating error only after trying to proceed

let reviewData = reactive({
  name: '',
  rating: 0,
  note: '',
  isReviewed: false,
});

const productId = Number(route.query.editProductId as string || route.query.scanId as string)

const productToReview = ref<ProductInteraction | null>(null);

onMounted(async () => {
  if (productId) {
    const existingItem = await historyStore.getProductInteractionById(productId);
    console.log("VIEW (onMounted): existingItem:", existingItem);
    if (existingItem) {
      productToReview.value = existingItem;
      reviewData.name = existingItem.name;
      reviewData.rating = existingItem.userRating || 0;
      reviewData.note = existingItem.userNotes || '';
      reviewData.isReviewed = existingItem.isReviewed || false;
    }
  }

  // Focus the first input
  nextTick(() => {
    productNameInputRef.value?.focus();
  });
});

const progressPercentage = computed(() => (currentStep.value / totalSteps) * 100);
const isNextDisabled = computed(() => {
  if (currentStep.value === 1 && !reviewData.name.trim()) return true;
  if (currentStep.value === 2 && reviewData.rating === 0) return true;
  // Notes can be optional, so step 3 doesn't have specific validation here for 'Next'
  return false;
});

const nextStep = () => {
  if (currentStep.value === 2 && reviewData.rating === 0) {
    triedToSubmitStep2.value = true; // Mark that user tried to proceed from step 2
    return; // Don't proceed if rating is 0
  }
  triedToSubmitStep2.value = false; // Reset if proceeding

  if (currentStep.value < totalSteps) {
    currentStep.value++;
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const handleNextOrSubmit = async () => {
  if (currentStep.value === 2 && reviewData.rating === 0) {
    triedToSubmitStep2.value = true;
    return;
  }
  if (isNextDisabled.value && currentStep.value < totalSteps) {
    // This case should ideally not be reached if button is disabled, but as a safeguard
    if (currentStep.value === 1) alert("Product name is required.");
    if (currentStep.value === 2) alert("Please provide a star rating.");
    return;
  }

  if (currentStep.value < totalSteps) {
    nextStep();
  } else {
    const isSuccess = await historyStore.saveOrUpdateUserReview(productId, reviewData as ReViewDataPayload);

    if (isSuccess && !historyStore.error) {
      // Check if new badges have been achieved
      await Promise.all([
        badgeStore.loadAllUserBadges(),
        historyStore.loadProductReviewStatistics()
      ])
      const badgeStatistics: BadgeStatistic = { totalReviewCount: historyStore.totalReviewed }
      await badgeStore.checkAllBadgesLogic(badgeStatistics)

      // Navigate to the product detail page of the newly reviewed/updated item
      router.push({ name: 'ProductDetail', params: { id: productId } });
    } else {
      // Error will be shown via historyStore.error in the template
      console.error("Failed to save review:", historyStore.error);
    }
  }
};

const goBack = () => {
  // Navigate back to where the user came from (ProductDetail or Scan results)
  const fromTitle = route.query.fromTitle as string;
  if (fromTitle && (fromTitle.toLowerCase().includes('details') || fromTitle.toLowerCase().includes('scan'))) {
     if (productId) { // If we had an ID, go back to that product's detail
        router.push({ name: 'ProductDetail', params: { id: productId } });
        return;
     }
  }
  // Fallback navigation
  if (window.history.state.back) {
    router.go(-1);
  } else {
    router.push({ name: 'Home' }); // Or History, depending on desired fallback
  }
};

</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
