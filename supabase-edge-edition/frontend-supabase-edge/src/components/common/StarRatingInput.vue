<template>
  <div class="flex items-center space-x-1 sm:space-x-1.5" :aria-label="`Rating: ${currentRating} out of ${maxStars} stars`">
    <button
      v-for="starIndex in maxStars"
      :key="starIndex"
      @click="setRating(starIndex)"
      @mouseover="setHoverRating(starIndex)"
      @mouseleave="clearHoverRating"
      type="button"
      class="p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-flavorpal-green-light transition-colors duration-150 ease-in-out"
      :aria-label="`Set rating to ${starIndex} star${starIndex > 1 ? 's' : ''}`"
      :aria-pressed="starIndex === currentRating"
    >
      <svg
        :class="[starSizeClasses, getStarColor(starIndex)]"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

const props = withDefaults(defineProps<{
  modelValue: number; // Current rating, for v-model
  maxStars?: number;
  starSize?: string;   // e.g., 'w-8 h-8', 'w-10 h-10'
  activeColor?: string;
  inactiveColor?: string;
  hoverColor?: string;
}>(), {
  maxStars: 5,
  starSize: 'w-8 h-8 sm:w-10 sm:h-10', // Default star size
  activeColor: 'text-yellow-400',
  inactiveColor: 'text-gray-300',
  hoverColor: 'text-yellow-300', // Color when hovering over a star
});

const emit = defineEmits(['update:modelValue']);

const currentRating = ref(props.modelValue);
const hoverRating = ref(0); // Tracks the rating if user is hovering

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  currentRating.value = newValue;
});

const starSizeClasses = computed(() => props.starSize);

const setRating = (rating: number) => {
  currentRating.value = rating;
  emit('update:modelValue', rating); // Emit event for v-model
};

const setHoverRating = (rating: number) => {
  hoverRating.value = rating;
};

const clearHoverRating = () => {
  hoverRating.value = 0;
};

const getStarColor = (starIndex: number): string => {
  if (hoverRating.value >= starIndex) {
    return props.hoverColor;
  }
  if (currentRating.value >= starIndex) {
    return props.activeColor;
  }
  return props.inactiveColor;
};
</script>

<style scoped>
/* No specific scoped styles needed if using Tailwind utility classes effectively. */
</style>
