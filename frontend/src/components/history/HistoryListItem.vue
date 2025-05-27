<template>
  <div
    @click="handleItemClick"
    role="article"
    tabindex="0"
    @keypress.enter="handleItemClick"
    :aria-labelledby="`historyItemName-${item.id}`"
    class="cursor-pointer transition-shadow duration-200 ease-in-out group" 
    :class="{
      'flex items-start p-4 bg-white rounded-xl shadow-lg hover:shadow-xl': viewMode === 'list',
      'bg-white rounded-xl shadow-lg hover:shadow-xl overflow-hidden flex flex-col': viewMode === 'grid'
    }"
  >
    <div 
      class="flex-shrink-0 bg-flavorpal-gray-light flex items-center justify-center overflow-hidden relative" 
      :class="{
        'w-16 h-16 sm:w-20 sm:h-20 rounded-lg mr-4': viewMode === 'list',
        'w-full h-32 sm:h-40': viewMode === 'grid' 
      }"
    >
      <div 
        v-if="item.isReviewed" 
        class="absolute top-0 left-0 z-10"
        aria-label="Item has been reviewed"
      >
        <div class="w-16 h-16 sm:w-20 sm:h-20 overflow-hidden">
          <div class="absolute transform -rotate-45 bg-flavorpal-green text-white text-center shadow-md"
            style="left: -28px; top: 8px; width: 90px; font-size: 0.6rem; padding: 1px 0; sm:left: -32px; sm:top: 10px; sm:width: 100px; sm:font-size: 0.65rem;"
            >
            Reviewed
          </div>
        </div>
      </div>

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
        class="text-gray-400"
        :class="{
          'w-10 h-10 sm:w-12 sm:h-12': viewMode === 'list',
          'w-12 h-12 sm:w-16 sm:h-16': viewMode === 'grid'
        }"
        style="display: flex;"
        fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
      </svg>
    </div>

    <div 
      class="flex-grow min-w-0 flex flex-col" :class="{
        'p-3 sm:p-4': viewMode === 'grid' 
      }"
    >
      <h3 
        :id="`historyItemName-${item.id}`"
        class="font-semibold text-flavorpal-gray-dark truncate group-hover:text-flavorpal-green transition-colors"
        :class="viewMode === 'list' ? 'text-lg' : 'text-base mb-1'"
      >
        {{ item.name }}
      </h3>

      <div v-if="item.isReviewed" class="my-1">
        <StarRating 
            v-if="typeof item.userRating === 'number'" 
            :rating="item.userRating" 
            :starSize="viewMode === 'list' ? 'w-4 h-4 sm:w-5 sm:h-5' : 'w-3.5 h-3.5 sm:w-4 sm:h-4'" 
        />
        <p 
            v-if="item.userNotes" 
            class="text-flavorpal-gray line-clamp-2 mt-1"
            :class="viewMode === 'list' ? 'text-sm' : 'text-xs'"
        >
            {{ item.userNotes }}
        </p>
      </div>

      <div v-else class="my-1">
        <p v-if="item.aiHealthSummary" 
            class="text-flavorpal-gray line-clamp-2"
            :class="viewMode === 'list' ? 'text-sm' : 'text-xs'"
        >
          {{ item.aiHealthSummary || "No summary available" }}
        </p>
        <div v-show="item.aiHealthConclusion" class="flex items-center mt-1.5">
          <span 
            class="w-2.5 h-2.5 rounded-full mr-1.5 flex-shrink-0"
            :class="getConclusionColor(item.aiHealthConclusion)"
            aria-hidden="true"
          ></span>
          <span 
            class="text-xs font-medium" 
            :class="getConclusionTextColor(item.aiHealthConclusion)"
          >
            {{ getConclusionText(item.aiHealthConclusion) }}
          </span>
        </div>
      </div>
      
      <div v-if="viewMode === 'list'" class="flex-grow"></div>

      <div class="text-xs text-gray-400 mt-2" :class="viewMode === 'list' ? 'self-end' : 'text-right'">
          {{ item.isReviewed && item.dateReviewed ? item.dateReviewed : item.dateScanned }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// ... (script setup remains the same as flavorpal_history_list_item)
import type { ProductInteraction, AiHealthConclusion } from '../../types';
import StarRating from '@/components/common/StarRating.vue'; 
import { useRouter } from 'vue-router';

const props = defineProps<{
  item: ProductInteraction;
  viewMode: 'list' | 'grid'; 
}>();

const router = useRouter();

const getConclusionColor = (conclusion?: AiHealthConclusion): string => {
  switch (conclusion) {
    case 'good': return 'bg-flavorpal-green';
    case 'caution': return 'bg-yellow-400';
    case 'avoid': return 'bg-red-500';
    case 'info_needed': return 'bg-blue-400';
    case 'neutral': default: return 'bg-gray-400';
  }
};
const getConclusionTextColor = (conclusion?: AiHealthConclusion): string => {
  switch (conclusion) {
    case 'good': return 'text-flavorpal-green-dark';
    case 'caution': return 'text-yellow-600';
    case 'avoid': return 'text-red-700';
    case 'info_needed': return 'text-blue-600';
    case 'neutral': default: return 'text-gray-600';
  }
};
const getConclusionText = (conclusion?: AiHealthConclusion): string => {
  switch (conclusion) {
    case 'good': return 'Looks good';
    case 'caution': return 'Use with caution';
    case 'avoid': return 'Best to avoid';
    case 'info_needed': return 'More info needed';
    case 'neutral': return 'Neutral';
    default: return 'Analysis pending';
  }
};

const handleItemClick = () => {
  router.push({ name: 'ProductDetail', params: { id: props.item.id } });
};
</script>

<style scoped>
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>
