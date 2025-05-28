<template>
  <div class="flex flex-col min-h-full bg-flavorpal-gray-light">
    <header
      class="sticky top-0 z-30 bg-white py-5 px-4 sm:px-6 shadow-sm flex items-center gap-x-1"
    >
      <button
        @click="goBack"
        class="bg-transparent text-flavorpal-green hover:text-flavorpal-green-dark rounded-full p-2
                hover:bg-flavorpal-gray-light duration-200 active:bg-flavorpal-gray-dark/40"
      >
        <IconArrowBack />
      </button>
      <h1 class="text-xl font-semibold text-flavorpal-gray-dark ml-2 truncate">Badges</h1>
    </header>

    <main class="flex-grow p-4 sm:p-6 space-y-5 overflow-y-auto">
      <button @click="testAddBadge">Debuggg</button>
      <div v-if="badgeStore.isLoading" class="text-center py-10">
        <svg class="animate-spin h-10 w-10 text-flavorpal-green mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="mt-3 text-flavorpal-gray">Loading badges...</p>
      </div>

      <div v-else-if="badgeStore.badges.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg gap-x-5 gap-y-5">
        <BadgeCard
          v-for="badge in badgeStore.badges"
          :key="badge.ref"
          :badge="badge"
          @click="handleOpenBadgePopup(badge)"
        >
          <BadgeCardContent :badge="badge"/>
        </BadgeCard>
      </div>

      <p v-if="badgeStore.error && !badgeStore.isLoading" class="text-center text-red-500 py-4">
        {{ badgeStore.error }}
      </p>
    </main>

    <BadgePopup
      v-if="selectedBadge !== null"
      :badge="selectedBadge"
      :handle-close-badge-popup="handleCloseBadgePopup"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import IconArrowBack from '@/components/icons/IconArrowBack.vue';
import BadgeCard from '@/components/badges/BadgeCard.vue';
import { useRouter } from 'vue-router';
import BadgeCardContent from '@/components/badges/BadgeCardContent.vue';
import BadgePopup from '@/components/badges/BadgePopup.vue';
import type { DisplayBadge } from '@/types';
import { useBadgeStore } from '@/store/badgeStore';
import { useHistoryStore } from '@/store/historyStore';

const badgeStore = useBadgeStore()
const historyStore = useHistoryStore()
const router = useRouter()

const selectedBadge = ref<DisplayBadge | null>(null);   // Controls badge modal visibility

const handleOpenBadgePopup = (badge: DisplayBadge) => {
  if (!badge.createdAt) {
    return
  }
  selectedBadge.value = badge
}
const handleCloseBadgePopup = () => selectedBadge.value = null

const testAddBadge = async () => {
  historyStore.totalScanned += 1
  console.log(historyStore.totalScanned)
  badgeStore.checkAllBadgesLogic(
    { totalReviewCount: historyStore.totalScanned },
    badgeStore.badges
  )
}

onMounted(() => {
  // Load badges data from badgeStore
  badgeStore.loadAllUserBadges();
});

const goBack = () => {
  if (window.history.state.back) {
    router.go(-1);
  } else {
    router.push({ name: 'Badges' });
  }
};

</script>
