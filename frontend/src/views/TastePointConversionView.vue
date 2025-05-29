<template>
  <div class="flex min-h-full flex-col bg-flavorpal-gray-light">
    <header class="sticky top-0 z-30 flex items-center bg-white p-4 shadow-sm">
      <button
        @click="goBack"
        class="-ml-2 rounded-full p-2 text-flavorpal-green hover:text-flavorpal-green-dark"
        aria-label="Back"
      >
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          ></path>
        </svg>
      </button>
      <h1 class="ml-2 truncate text-xl font-semibold text-flavorpal-gray-dark">
        Convert TastePoints
      </h1>
    </header>

    <GiftList
      :title="mockLinePointsGifts.title"
      :giftList="mockLinePointsGifts.giftList"
      :onGiftRedeem="mockGiftRedeemCallback"
    />
    <GiftList
      :title="mockOthersGifts.title"
      :giftList="mockOthersGifts.giftList"
      :onGiftRedeem="mockGiftRedeemCallback"
    />
    <UpcomingFeatureModal
      :is-open="isUpcomingModalOpen"
      :feature-name="upcomingFeatureName"
      @close="isUpcomingModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import GiftList from '@/components/pointConversion/GiftList.vue'
import type { PointConversionGift } from '@/types'
import { useRoute, useRouter } from 'vue-router'
import UpcomingFeatureModal from '@/components/common/UpcomingFeatureModal.vue';
import { ref } from 'vue';

const router = useRouter()
const isUpcomingModalOpen = ref(false);
const upcomingFeatureName = ref('');

const showUpcomingFeatureModal = (feature: string) => {
  upcomingFeatureName.value = feature;
  isUpcomingModalOpen.value = true;
};

// Define mock data for point shop
const mockLinePointsGifts: { title: string; giftList: PointConversionGift[] } = {
  title: 'Line Points',
  giftList: [
    { id: '1-line-point', name: '1 LINE Point', requiredPoints: 10, icon: 'coin' },
    { id: '10-line-point', name: '10 LINE Points', requiredPoints: 95, icon: 'coin' },
    { id: '50-line-point', name: '50 LINE Points', requiredPoints: 425, icon: 'coin' },
    { id: '100-line-point', name: '100 LINE Points', requiredPoints: 900, icon: 'coin' },
  ],
}

const mockOthersGifts: { title: string; giftList: PointConversionGift[] } = {
  title: 'Others',
  giftList: [
    {
      id: 'coffeediscount-50',
      name: 'Coffee shop 50% discount',
      requiredPoints: 500,
      icon: 'drink',
    },
    {
      id: 'convenience-5',
      name: '5% Off at コンビニA',
      requiredPoints: 100,
      icon: 'shopping-cart',
    },
  ],
}

const goBack = () => {
  /* ... as before ... */
  if (window.history.state.back) {
    router.go(-1)
  } else {
    router.push({ name: 'Discover' })
  }
}

const mockGiftRedeemCallback = () => {
  showUpcomingFeatureModal('Taste Point Conversion');
}
</script>
