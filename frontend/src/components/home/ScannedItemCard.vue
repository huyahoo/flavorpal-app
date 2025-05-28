<template>
  <div
    class="flex items-start p-3 sm:p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out cursor-pointer"
    @click="handleItemClick"
    role="article"
    tabindex="0"
    @keypress.enter="handleItemClick"
    :aria-labelledby="`scannedItemName-${item.id}`"
  >
    <div class="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-flavorpal-gray-light rounded-lg flex items-center justify-center mr-3 sm:mr-4 overflow-hidden">
      <img 
        v-if="item.imageUrl" 
        :src="item.imageUrl" 
        :alt="item.name" 
        class="w-full h-full object-contain"
        loading="lazy"
        onerror="this.style.display='none'; this.nextSibling.style.display='flex';" 
      />
      <svg 
        v-else 
        class="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" 
        style="display: flex;"
        fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
      </svg>
    </div>

    <div class="flex-grow min-w-0"> 
      <h3 :id="`scannedItemName-${item.id}`" class="font-semibold text-base sm:text-lg text-flavorpal-gray-dark truncate">{{ item.name }}</h3>
      
      <p v-if="item.aiHealthSummary" class="text-xs sm:text-sm text-flavorpal-gray mt-1 line-clamp-2">
        {{ item.aiHealthSummary }}
      </p>
      <p v-else class="text-xs sm:text-sm text-gray-400 italic mt-1">No health summary available.</p>

      <div v-if="item.aiHealthConclusion" class="flex items-center mt-2">
        <span 
          class="w-3 h-3 rounded-full mr-1.5 flex-shrink-0"
          :class="getConclusionColor(item.aiHealthConclusion)"
          aria-hidden="true"
        ></span>
        <span class="text-xs font-medium" :class="getConclusionTextColor(item.aiHealthConclusion)">
          {{ getConclusionText(item.aiHealthConclusion) }}
        </span>
      </div>
       <p class="text-xs text-gray-400 mt-1 text-right">{{ item.dateScanned }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// MODIFIED: Changed ScannedItem to ProductInteraction
import type { ProductInteraction, AiHealthConclusion } from '../../types'; 
import { useRouter } from 'vue-router';

const props = defineProps<{
  item: ProductInteraction; // MODIFIED: Use ProductInteraction
}>();

const router = useRouter();

// Function to determine the color class for the AI health conclusion dot
const getConclusionColor = (conclusion?: AiHealthConclusion): string => {
  switch (conclusion) {
    case 'ok': return 'bg-flavorpal-green'; // Green for good
    case 'neutral': return 'bg-yellow-400';   // Yellow for caution
    case 'avoid': return 'bg-red-500';        // Red for avoid
    case 'unknown': return 'bg-blue-400'; // Blue for info needed
    case 'error_analyzing':
    default: return 'bg-gray-400';        // Gray for neutral or undefined
  }
};

const getConclusionTextColor = (conclusion?: AiHealthConclusion): string => {
  switch (conclusion) {
    case 'ok': return 'text-flavorpal-green-dark';
    case 'neutral': return 'text-yellow-600';
    case 'avoid': return 'text-red-700';
    case 'unknown': return 'text-blue-600';
    case 'error_analyzing':
    default: return 'text-gray-600';
  }
};

const getConclusionText = (conclusion?: AiHealthConclusion): string => {
  switch (conclusion) {
    case 'ok': return 'Looks good for you';
    case 'neutral': return 'Use with caution';
    case 'avoid': return 'Best to avoid';
    case 'unknown': return 'More info needed';
    case 'error_analyzing': return 'Analysis Error';
    default: return 'More info needed';
  }
};

// Handler for when the item card is clicked
const handleItemClick = () => {
  console.log('Scanned item clicked:', props.item.id);
  // Navigate to a product detail page, passing the item's ID or barcode
  // This assumes you have a route like '/product/:id' or similar.
  // If the item was scanned via barcode and you want to use that:
  const identifier = props.item.barcode || props.item.id;
  router.push({ name: 'ProductDetail', params: { id: props.item.id } });
};
</script>

<style scoped>
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; /* Show a maximum of 2 lines */
}
</style>
