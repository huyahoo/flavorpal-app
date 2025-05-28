<template>
  <div class="flex items-center" :aria-label="`Rating: ${rating} out of ${maxStars} stars`">
    <svg 
      v-for="starIndex in maxStars" 
      :key="starIndex" 
      :class="[starSizeClasses, getStarColor(starIndex)]" 
      fill="currentColor" 
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-hidden="true" >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
    </svg>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  rating: number;
  maxStars?: number;
  starSize?: string; // e.g., 'w-4 h-4', 'w-5 h-5'
  activeColor?: string; // e.g., 'text-yellow-400'
  inactiveColor?: string; // e.g., 'text-gray-300'
  // showTextRating?: boolean; // If you want to show (4.5) next to stars
}>(), {
  maxStars: 5,
  starSize: 'w-4 h-4', // Default star size
  activeColor: 'text-yellow-400',
  inactiveColor: 'text-gray-300',
  // showTextRating: false,
});

// Computed property for star size classes to keep template cleaner
const starSizeClasses = computed(() => props.starSize);

// Function to determine the color of each star based on the rating
const getStarColor = (starIndex: number): string => {
  // For full stars
  if (props.rating >= starIndex) {
    return props.activeColor;
  }
  // For half stars (more complex, not implemented in this basic version but could be added)
  // Example for half star:
  // if (props.rating > starIndex - 1 && props.rating < starIndex) {
  //   return 'text-yellow-300'; // Or use a half-star icon
  // }
  return props.inactiveColor; // For empty stars
};
</script>

<style scoped>
/* No specific scoped styles needed if using Tailwind utility classes effectively. */
</style>
