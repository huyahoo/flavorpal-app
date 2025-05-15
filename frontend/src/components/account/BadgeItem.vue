<template>
  <div 
    class="flex-shrink-0 flex flex-col items-center w-16 sm:w-20 text-center group cursor-pointer"
    :title="badge.description"
    @click="handleBadgeClick"
    role="listitem"
    tabindex="0"
    @keypress.enter="handleBadgeClick"
    :aria-label="badge.name + ': ' + badge.description"
  >
    <div 
      class="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-3xl sm:text-4xl mb-1 shadow-md transition-transform duration-200 ease-in-out group-hover:scale-110"
      :style="{ backgroundColor: badge.bgColor || '#E5E7EB', color: badge.iconColor || '#4B5563' }"
    >
      <span>{{ badge.icon }}</span>
    </div>
    </div>
</template>

<script setup lang="ts">
import type { DisplayBadge } from '../../types'; // Import the DisplayBadge type

// Define the props for this component
// It expects a 'badge' object of type DisplayBadge.
const props = defineProps<{
  badge: DisplayBadge;
}>();

// Placeholder function for when a badge is clicked
// In a real app, this might show a modal with badge details or navigate somewhere.
const handleBadgeClick = () => {
  console.log('Badge clicked:', props.badge.name);
  alert(`Badge: ${props.badge.name}\nDescription: ${props.badge.description}\nEarned: ${props.badge.dateEarned}`);
};
</script>

<style scoped>
/* Add any component-specific styles here if needed. */
/* For example, if you wanted a specific border on hover for the icon container: */
/* .group:hover div:first-child {
  border: 2px solid var(--flavorpal-green); // Assuming CSS variable for green
} */
</style>
