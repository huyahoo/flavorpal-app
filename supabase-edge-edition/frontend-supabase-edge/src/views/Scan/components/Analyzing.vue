<template>
    <div class="absolute inset-0 bg-gray-800/95 backdrop-blur-sm flex flex-col items-center justify-center z-40 p-6">
        <svg class="animate-spin h-12 w-12 text-flavorpal-green mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-xl font-semibold text-white mb-3">Analyzing Product...</p>
        <p class="text-sm text-gray-300 mb-8 text-center">Please wait while we fetch and analyze product information.</p>
        <button @click="cancelAnalysisCallback" class="bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors">
            Cancel Analysis
        </button>
    </div>
</template>

<script setup lang="ts">
interface Props {
    cancelAnalysisCallback: () => void;
}
const props = defineProps<Props>();
</script>