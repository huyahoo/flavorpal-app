<template>
    <header 
      class="absolute top-0 left-0 z-30 p-3 sm:p-4 w-full"
      :style="{ paddingTop: `calc(env(safe-area-inset-top, 0px) + 0.75rem)` }"
    >
      <button 
        @click="goBack" 
        class="p-2 rounded-full hover:bg-white/20 focus:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50" 
        aria-label="Go back"
      >
        <svg class="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
    </header>
    <!-- v-if="!isCameraActive && scanStore.currentStage !== 'analyzing'"  -->
</template>

<script setup lang="ts">
interface Props {
  goBack: () => void;
}
const props = defineProps<Props>();
</script>