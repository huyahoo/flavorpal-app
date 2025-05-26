<template>
  <div
    class="absolute bottom-0 left-0 right-0 z-30 mx-auto max-w-md p-4 sm:p-6"
    :style="{ paddingBottom: `env(safe-area-inset-bottom, 0px)` }"
    aria-live="polite"
  >
    <div
      class="animate-slide-up space-y-4 rounded-t-2xl bg-white p-5 text-flavorpal-gray-dark shadow-2xl sm:rounded-2xl"
    >
      <div
        class="relative mb-3 flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-lg bg-flavorpal-gray-light"
      >
        <div
          v-if="productForDisplay.isReviewed"
          class="absolute left-0 top-0 z-10"
          aria-label="Item has been reviewed"
        >
          <div class="h-24 w-24 overflow-hidden">
            <div
              class="absolute -rotate-45 transform bg-flavorpal-green text-center text-white shadow-md"
              style="left: -30px; top: 12px; width: 110px; font-size: 0.7rem; padding: 2px 0"
            >
              Reviewed
            </div>
          </div>
        </div>
        <img
          v-if="productForDisplay.imageUrl"
          :src="productForDisplay.imageUrl"
          :alt="productForDisplay.name"
          class="min-h-screen w-full object-contain"
          onerror="this.style.display='none'; this.nextSibling.style.display='flex';"
        />
        <svg
          v-else
          class="h-12 w-12 text-gray-400"
          style="display: flex"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          ></path>
        </svg>
      </div>

      <div v-if="productForDisplay.isReviewed">
        <h3 class="mb-1 text-lg font-semibold">{{ productForDisplay.name }}</h3>
        <StarRating
          v-if="typeof productForDisplay.userRating === 'number'"
          :rating="productForDisplay.userRating"
          starSize="w-5 h-5"
          class="mb-1"
        />
        <p v-if="productForDisplay.dateReviewed" class="mb-2 text-xs text-gray-500">
          Reviewed on: {{ productForDisplay.dateReviewed }}
        </p>
        <p class="mb-3 line-clamp-3 text-sm text-gray-600">
          {{ productForDisplay.userNotes || 'You have reviewed this item.' }}
        </p>
        <div class="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <button
            @click="scanAnotherCallback"
            class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 sm:w-auto sm:border-transparent"
          >
            Scan Another
          </button>
          <button
            @click="handleNavigateToProductDetail"
            class="w-full rounded-lg bg-flavorpal-green px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-flavorpal-green-dark sm:w-auto"
          >
            View Full Review &rarr;
          </button>
        </div>
      </div>

      <div v-else>
        <h3 class="mb-1 text-lg font-semibold">{{ productForDisplay.name }}</h3>
        <p class="mb-1 line-clamp-2 text-sm text-gray-600">
          {{ productForDisplay.aiHealthSummary || 'Product information processed.' }}
        </p>
        <div v-if="productForDisplay.aiHealthConclusion" class="mb-3 flex items-center">
          <span
            class="mr-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full"
            :class="getConclusionColor(productForDisplay.aiHealthConclusion)"
            aria-hidden="true"
          ></span>
          <span
            class="text-xs font-medium"
            :class="getConclusionTextColor(productForDisplay.aiHealthConclusion)"
          >
            {{ getConclusionText(productForDisplay.aiHealthConclusion) }}
          </span>
        </div>
        <div class="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <button
            @click="handleScanAnother"
            class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 sm:w-auto sm:border-transparent"
          >
            Scan Another
          </button>
          <button
            @click="handleNavigateToProductDetail"
            class="w-full rounded-lg bg-flavorpal-orange px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-flavorpal-orange-dark sm:w-auto"
          >
            See Details &rarr;
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProductInteraction, AiHealthConclusion } from '@/types';
import StarRating from '@/components/common/StarRating.vue';

interface Props {
  productForDisplay: ProductInteraction;
  scanAnotherCallback: () => void;
  navigateToProductDetailCallback: (product_id: string) => void;
}

const props = defineProps<Props>();

const handleScanAnother = () => {
  props.scanAnotherCallback();
};

const handleNavigateToProductDetail = () => {
  props.navigateToProductDetailCallback(props.productForDisplay.id);
};

// --- AI Conclusion Styling Helpers ---
const getConclusionColor = (conclusion?: AiHealthConclusion): string => { /* ... */ 
  switch (conclusion) {
    case 'good': return 'bg-flavorpal-green';
    case 'caution': return 'bg-yellow-400';
    case 'avoid': return 'bg-red-500';
    case 'info_needed': return 'bg-blue-400';
    case 'error_analyzing': return 'bg-purple-500';
    case 'neutral': default: return 'bg-gray-400';
  }
};
const getConclusionTextColor = (conclusion?: AiHealthConclusion): string => { /* ... */ 
  switch (conclusion) {
    case 'good': return 'text-flavorpal-green-dark';
    case 'caution': return 'text-yellow-600';
    case 'avoid': return 'text-red-700';
    case 'info_needed': return 'text-blue-600';
    case 'error_analyzing': return 'text-purple-700';
    case 'neutral': default: return 'text-gray-600';
  }
};
const getConclusionText = (conclusion?: AiHealthConclusion): string => { /* ... */ 
  switch (conclusion) {
    case 'good': return 'Looks good for you';
    case 'caution': return 'Use with caution';
    case 'avoid': return 'Best to avoid';
    case 'info_needed': return 'More info needed';
    case 'error_analyzing': return 'Analysis Error';
    case 'neutral': return 'Neutral';
    default: return 'Analysis pending';
  }
};
</script>
