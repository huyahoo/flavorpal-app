<template>
  <div
    class="flex-shrink-0 flex flex-col items-center w-16 sm:w-20 text-center group cursor-pointer"
    :title="badge.description"
    @click="handleOpenBadgePopup"
    role="listitem"
    tabindex="0"
    @keypress.enter="handleOpenBadgePopup"
    :aria-label="badge.name + ': ' + badge.description"
  >
    <div
      class="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-3xl sm:text-4xl mb-1 shadow-md transition-transform duration-200 ease-in-out group-hover:scale-110"
      :style="{ backgroundColor: '#E5E7EB' }"
    >
      <img :src="badge.imageUrl" class="w-10 h-10" />
    </div>
  </div>
  <BadgePopup
    v-if="isBadgeModelOpen"
    :badge="badge"
    :handle-close-badge-popup="handleCloseBadgePopup"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { DisplayBadge } from '../../types'; // Import the DisplayBadge type
import BadgePopup from '../badges/BadgePopup.vue';

const isBadgeModelOpen = ref<boolean>(false);   // Controls badge modal visibility

// Define the props for this component
// It expects a 'badge' object of type DisplayBadge.
const { badge } = defineProps<{
  badge: DisplayBadge;
}>();

const handleOpenBadgePopup = () => isBadgeModelOpen.value = true
const handleCloseBadgePopup = () => isBadgeModelOpen.value = false

</script>

<style scoped>
/* Add any component-specific styles here if needed. */
/* For example, if you wanted a specific border on hover for the icon container: */
/* .group:hover div:first-child {
  border: 2px solid var(--flavorpal-green); // Assuming CSS variable for green
} */
</style>
