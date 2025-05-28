<template>
    <div class="absolute inset-0 bg-gray-800/95 backdrop-blur-sm flex flex-col items-center justify-center z-30 p-6 text-center">
          <svg class="w-12 h-12 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <p class="text-xl font-semibold text-white mb-2">Scan Failed</p>
          <p class="text-sm text-gray-300 mb-6">{{ errorMessage || 'An unknown error occurred.' }}</p>
          <button @click="resetCallback" class="bg-flavorpal-green hover:bg-flavorpal-green-dark text-white font-medium py-2.5 px-6 rounded-lg transition-colors"> Try Again </button>
      </div>
</template>

<script setup lang="ts">
interface Props {
    errorMessage: string | null;
    resetCallback: () => void;
}
const props = defineProps<Props>();
</script>
