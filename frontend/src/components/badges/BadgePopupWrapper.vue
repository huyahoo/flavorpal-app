<template>
  <BadgePopup
    v-if="selectedBadge !== null"
    :badge="selectedBadge"
    :handle-close-badge-popup="handleCloseBadgePopup"
  />
</template>

<script setup lang="ts">
import BadgePopup from './BadgePopup.vue';
import { computed } from 'vue';
import { useBadgeStore } from '@/store/badgeStore';

const badgeStore = useBadgeStore()
const selectedBadge = computed(
  () => badgeStore.selectedBadges.length > 0 ?
    badgeStore.selectedBadges[0] : null
)

const handleCloseBadgePopup = () => {
  badgeStore.popBadgeToShow()
}

</script>
