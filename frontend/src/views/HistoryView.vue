<template>
  <div class="flex flex-col min-h-full bg-flavorpal-gray-light">
    <header class="sticky top-0 z-40 bg-flavorpal-gray-light pt-6 pb-4 px-4 sm:px-6 shadow-sm">
      <h1 class="text-2xl sm:text-3xl font-bold text-flavorpal-gray-dark mb-4 text-center sm:text-left">History</h1>
      <div class="flex items-center space-x-3">
        <div class="relative flex-grow">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            v-model="historyStore.filterSearchQuery" placeholder="Search history (name, notes)..."
            class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-flavorpal-green focus:border-flavorpal-green sm:text-sm transition-shadow"
            aria-label="Search product history"
          />
        </div>
        <button
          @click="openFilterModal"
          class="p-2.5 bg-white border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-flavorpal-green focus:outline-none focus:ring-2 focus:ring-flavorpal-green focus:border-flavorpal-green transition-colors relative"
          aria-label="Filter history"
        >
          <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 12.414V17a1 1 0 01-1.447.894l-2-1A1 1 0 018 16.055V12.414L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd" />
          </svg>
          <span v-if="historyStore.activeFilterCount > 0" class="absolute -top-1.5 -right-1.5 bg-flavorpal-orange text-white text-xs font-semibold rounded-full h-4.5 w-4.5 flex items-center justify-center p-0.5 leading-none">
            {{ historyStore.activeFilterCount }}
          </span>
        </button>
        <button
          @click="toggleViewMode"
          class="p-2.5 bg-white border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-flavorpal-green focus:outline-none focus:ring-2 focus:ring-flavorpal-green focus:border-flavorpal-green transition-colors"
          aria-label="Toggle view mode"
        >
          <svg v-if="viewMode === 'list'" class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <svg v-else class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </header>

    <main class="flex-grow p-4 sm:p-6">
      <div v-if="historyStore.loadingInteractions" class="text-center py-12">
        <svg class="animate-spin h-10 w-10 text-flavorpal-green mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="mt-3 text-flavorpal-gray">Loading history...</p>
      </div>
      <div v-else-if="processedHistoryItems.length > 0">
        <div :class="viewMode === 'list' ? 'space-y-4' : 'grid grid-cols-2 gap-4 sm:gap-5'">
          <HistoryListItem
            v-for="item in processedHistoryItems"
            :key="item.id + '-' + viewMode"
            :item="item"
            :view-mode="viewMode"
          />
        </div>
      </div>
      <div v-else class="text-center py-12">
        <svg class="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0zM17.657 17.657L19.5 19.5M4.5 19.5l1.843-1.843"></path></svg>
        <p class="text-xl text-flavorpal-gray-dark font-medium">No History Found</p>
        <p v-if="historyStore.filterSearchQuery || historyStore.activeFilterCount > 0" class="text-flavorpal-gray mt-1">Try adjusting your search or filters.</p>
        <p v-else class="text-flavorpal-gray mt-1">Start scanning or reviewing products to build your history!</p>
      </div>
      <p v-if="historyStore.error && !historyStore.loadingInteractions" class="text-sm text-red-500 mt-4 text-center">
        Error loading history: {{ historyStore.error }}
      </p>
    </main>

    <div v-if="showFilterModal" class="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out" @click.self="closeFilterModal">
        <div class="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full transform transition-all duration-300 ease-in-out" :class="showFilterModal ? 'scale-100 opacity-100' : 'scale-95 opacity-0'">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-semibold text-flavorpal-gray-dark">Filter History</h3>
                <button @click="closeFilterModal" class="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                  <IconClose />
                </button>
            </div>
            <div class="space-y-5">
                <div>
                    <label for="filter-date-history" class="block text-sm font-medium text-gray-700">Scanned/Reviewed on or after</label>
                    <input
                        type="date"
                        id="filter-date-history"
                        v-model="tempFilters.dateAfter"
                        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-flavorpal-green focus:border-flavorpal-green sm:text-sm p-2.5">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Item Status</label>
                    <div class="space-y-2">
                        <label v-for="statusOption in reviewedStatusOptions" :key="statusOption.value" class="flex items-center text-sm text-gray-700">
                            <input type="radio" :value="statusOption.value" v-model="tempFilters.reviewedStatus" name="reviewedStatus" class="focus:ring-flavorpal-green h-4 w-4 text-flavorpal-green border-gray-300">
                            <span class="ml-2">{{ statusOption.label }}</span>
                        </label>
                    </div>
                </div>

                <div v-if="tempFilters.reviewedStatus === 'reviewed_only'" class="transition-all duration-300 ease-in-out">
                    <label for="filter-rating-history" class="block text-sm font-medium text-gray-700">Minimum Rating</label>
                    <select
                        id="filter-rating-history"
                        v-model.number="tempFilters.minRating"
                        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-flavorpal-green focus:border-flavorpal-green sm:text-sm p-2.5">
                        <option value="0">Any Rating</option>
                        <option value="1">1 Star & Up</option>
                        <option value="2">2 Stars & Up</option>
                        <option value="3">3 Stars & Up</option>
                        <option value="4">4 Stars & Up</option>
                        <option value="5">5 Stars</option>
                    </select>
                </div>

                <div v-if="tempFilters.reviewedStatus === 'scanned_only'" class="transition-all duration-300 ease-in-out">
                    <label for="filter-ai-conclusion-history" class="block text-sm font-medium text-gray-700">AI Health Conclusion</label>
                    <select
                        id="filter-ai-conclusion-history"
                        v-model="tempFilters.aiConclusion"
                        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-flavorpal-green focus:border-flavorpal-green sm:text-sm p-2.5">
                        <option value="">Any Conclusion</option>
                        <option v-for="conclusion in aiConclusionOptions" :key="conclusion.value" :value="conclusion.value">
                            {{ conclusion.label }}
                        </option>
                    </select>
                </div>
            </div>
            <div class="mt-8 flex justify-between items-center">
                 <button @click="clearAndCloseFilters" class="px-4 py-2 text-sm font-medium text-flavorpal-orange hover:text-flavorpal-orange-dark transition-colors rounded-lg hover:bg-orange-50">
                    Clear Filters
                </button>
                <div class="space-x-3">
                    <button @click="closeFilterModal" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                        Cancel
                    </button>
                    <button @click="applyFiltersAndClose" class="px-4 py-2 text-sm font-medium text-white bg-flavorpal-green hover:bg-flavorpal-green-dark rounded-lg transition-colors">
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue';
import { useHistoryStore, type ReviewedFilterStatus } from '../store/historyStore'; // Import store and types
import type { AiHealthConclusion } from '../types';
import HistoryListItem from '@/components/history/HistoryListItem.vue'; // Import the list item component
import IconClose from '@/components/icons/IconClose.vue';

const historyStore = useHistoryStore();

// --- Local State for UI Control ---
const viewMode = ref<'list' | 'grid'>('list'); // Default view mode
const showFilterModal = ref<boolean>(false);   // Controls filter modal visibility

// Temporary state for filter inputs within the modal
const tempFilters = reactive({
  dateAfter: '',
  reviewedStatus: 'all' as ReviewedFilterStatus,
  minRating: 0,
  aiConclusion: '' as AiHealthConclusion | '',
});

// --- Options for Select/Radio ---
const reviewedStatusOptions = [
  { label: 'Show All Items', value: 'all' as ReviewedFilterStatus },
  { label: 'Reviewed by Me', value: 'reviewed_only' as ReviewedFilterStatus },
  { label: 'Just Scanned (Not Reviewed)', value: 'scanned_only' as ReviewedFilterStatus },
];

const aiConclusionOptions: { label: string, value: AiHealthConclusion }[] = [
  { label: 'Looks good for you', value: 'ok' },
  { label: 'Use with caution', value: 'neutral' },
  { label: 'Best to avoid', value: 'avoid' },
  { label: 'More info needed', value: 'unknown' },
  { label: 'Analysis Error', value: 'error_analyzing' },
];


// --- Computed Properties ---
// Get processed (filtered and sorted) items from the store
const processedHistoryItems = computed(() => historyStore.processedHistoryItems);
// Bind search query directly to the store state for two-way data binding
const searchQuery = computed({
  get: () => historyStore.filterSearchQuery,
  set: (value) => historyStore.filterSearchQuery = value,
});


// --- Lifecycle Hooks ---
onMounted(() => {
  // Load product interactions if not already loaded or if forced
  // The store action itself can decide if it needs to re-fetch.
  historyStore.loadProductInteractions(true);
});

// --- Event Handlers ---
const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'list' ? 'grid' : 'list';
};

const openFilterModal = () => {
  // When opening modal, populate tempFilters with current active filters from store
  tempFilters.dateAfter = historyStore.filterDateAfter;
  tempFilters.reviewedStatus = historyStore.filterReviewedStatus;
  tempFilters.minRating = historyStore.filterMinRating;
  tempFilters.aiConclusion = historyStore.filterAiConclusion || '';
  showFilterModal.value = true;
};

const closeFilterModal = () => {
  showFilterModal.value = false;
  // Optionally reset tempFilters to active filters if user cancels without applying
};

const applyFiltersAndClose = () => {
  // Update the store's filter state with values from tempFilters
  historyStore.setFilters({
    dateAfter: tempFilters.dateAfter,
    reviewedStatus: tempFilters.reviewedStatus,
    minRating: tempFilters.reviewedStatus === 'reviewed_only' ? tempFilters.minRating : 0,
    aiConclusion: tempFilters.reviewedStatus === 'scanned_only' ? tempFilters.aiConclusion : '',
  });
  closeFilterModal();
};

const clearAndCloseFilters = () => {
    historyStore.clearAllFilters(); // Call store action to clear filters
    // Also reset temporary modal filters
    tempFilters.dateAfter = '';
    tempFilters.reviewedStatus = 'all';
    tempFilters.minRating = 0;
    tempFilters.aiConclusion = '';
    closeFilterModal();
};

// viewItemDetail is now handled by HistoryListItem.vue's handleItemClick
</script>

<style scoped>
/* Styles for filter modal transition and active filter badge */
.fixed.inset-0.bg-black.bg-opacity-75 {
    transition: opacity 0.3s ease-in-out;
}
.fixed.inset-0.bg-black.bg-opacity-75 > div { /* Modal content */
    transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
}
.h-4\.5 { /* Custom size for filter count badge if needed */
    height: 1.125rem; /* 18px */
}
.w-4\.5 {
    width: 1.125rem; /* 18px */
}
</style>
