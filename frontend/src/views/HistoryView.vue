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
            v-model="searchQuery"
            placeholder="Search history..."
            class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-flavorpal-green focus:border-flavorpal-green sm:text-sm transition-shadow"
            aria-label="Search product history"
          />
        </div>
        <button
          @click="toggleFilterModal"
          class="p-2.5 bg-white border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-flavorpal-green focus:outline-none focus:ring-2 focus:ring-flavorpal-green focus:border-flavorpal-green transition-colors relative"
          aria-label="Filter history"
        >
          <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 12.414V17a1 1 0 01-1.447.894l-2-1A1 1 0 018 16.055V12.414L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd" />
          </svg>
          <span v-if="activeFilterCount > 0" class="absolute -top-1 -right-1 bg-flavorpal-orange text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {{ activeFilterCount }}
          </span>
        </button>
        <button
          @click="toggleViewMode"
          class="p-2.5 bg-white border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-flavorpal-green focus:outline-none focus:ring-2 focus:ring-flavorpal-green focus:border-flavorpal-green transition-colors"
          aria-label="Toggle view mode"
        >
          <svg v-if="viewMode === 'list'" class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <svg v-else class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </header>

    <main class="flex-grow p-4 sm:p-6">
      <div v-if="processedHistoryItems.length > 0">
        <div v-if="viewMode === 'list'" class="space-y-4">
          <div
            v-for="item in processedHistoryItems"
            :key="item.id + '-list'"
            class="flex items-start p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 ease-in-out cursor-pointer"
            @click="viewItemDetail(item.id)"
            role="button"
            tabindex="0"
            @keypress.enter="viewItemDetail(item.id)"
            aria-labelledby="`itemName-list-${item.id}`"
          >
            <div class="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-flavorpal-gray-light rounded-lg flex items-center justify-center mr-4 overflow-hidden">
              <img
                v-if="item.imageUrl"
                :src="item.imageUrl"
                :alt="item.name"
                class="w-full h-full object-cover"
                onerror="this.style.display='none'; this.nextSibling.style.display='flex';"
              />
              <svg
                v-else
                class="w-10 h-10 sm:w-12 sm:h-12 text-gray-400"
                style="display: flex;"
                fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <div class="flex-grow min-w-0">
              <div class="flex justify-between items-start">
                  <h3 :id="`itemName-list-${item.id}`" class="font-semibold text-lg text-flavorpal-gray-dark truncate pr-2">{{ item.name }}</h3>
                  <span class="text-xs text-gray-400 whitespace-nowrap">{{ item.dateScanned }}</span>
              </div>
              <div class="flex items-center my-1">
                <svg v-for="star in 5" :key="star" class="w-4 h-4 sm:w-5 sm:h-5" :class="star <= item.rating ? 'text-yellow-400' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <span class="ml-1.5 text-xs text-gray-500">({{ item.rating.toFixed(1) }})</span>
              </div>
              <p class="text-sm text-flavorpal-gray line-clamp-2">{{ item.notes }}</p>
            </div>
          </div>
        </div>

        <div v-else-if="viewMode === 'grid'" class="grid grid-cols-2 gap-4 sm:gap-5">
          <div
            v-for="item in processedHistoryItems"
            :key="item.id + '-grid'"
            class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out cursor-pointer overflow-hidden flex flex-col"
            @click="viewItemDetail(item.id)"
            role="button"
            tabindex="0"
            @keypress.enter="viewItemDetail(item.id)"
            aria-labelledby="`itemName-grid-${item.id}`"
          >
            <div class="w-full h-32 sm:h-40 bg-flavorpal-gray-light flex items-center justify-center overflow-hidden">
              <img
                v-if="item.imageUrl"
                :src="item.imageUrl"
                :alt="item.name"
                class="w-full h-full object-cover"
                onerror="this.style.display='none'; this.nextSibling.style.display='flex';"
              />
              <svg
                v-else
                class="w-12 h-12 sm:w-16 sm:h-16 text-gray-400"
                style="display: flex;"
                fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <div class="p-3 sm:p-4 flex flex-col flex-grow">
              <h3 :id="`itemName-grid-${item.id}`" class="font-semibold text-base text-flavorpal-gray-dark truncate mb-1">{{ item.name }}</h3>
              <div class="flex items-center my-0.5">
                <svg v-for="star in 5" :key="star" class="w-3.5 h-3.5 sm:w-4 sm:h-4" :class="star <= item.rating ? 'text-yellow-400' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <span class="ml-1 text-xs text-gray-500">({{ item.rating.toFixed(1) }})</span>
              </div>
              <p class="text-xs text-flavorpal-gray line-clamp-2 mt-1 flex-grow">{{ item.notes }}</p>
               <span class="text-xs text-gray-400 mt-2 text-right">{{ item.dateScanned }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-12">
        <svg class="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0zM17.657 17.657L19.5 19.5M4.5 19.5l1.843-1.843"></path></svg>
        <p class="text-xl text-flavorpal-gray-dark font-medium">No History Found</p>
        <p v-if="searchQuery || selectedDateFilter || selectedMinRating > 0" class="text-flavorpal-gray mt-1">Try adjusting your search or filters.</p>
        <p v-else class="text-flavorpal-gray mt-1">Start scanning products to build your history!</p>
      </div>
    </main>

    <div v-if="showFilterModal" class="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out" @click.self="showFilterModal = false">
        <div class="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full transform transition-all duration-300 ease-in-out" :class="showFilterModal ? 'scale-100 opacity-100' : 'scale-95 opacity-0'">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold text-flavorpal-gray-dark">Filter Options</h3>
                <button @click="showFilterModal = false" class="text-gray-400 hover:text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
            <div class="space-y-4">
                <div>
                    <label for="filter-date-input" class="block text-sm font-medium text-gray-700">Scanned on or after date</label>
                    <input 
                        type="date" 
                        id="filter-date-input" 
                        v-model="tempSelectedDate"
                        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-flavorpal-green focus:border-flavorpal-green sm:text-sm p-2">
                </div>
                <div>
                    <label for="filter-rating-select" class="block text-sm font-medium text-gray-700">Minimum Rating</label>
                    <select 
                        id="filter-rating-select" 
                        v-model.number="tempSelectedMinRating"
                        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-flavorpal-green focus:border-flavorpal-green sm:text-sm p-2">
                        <option value="0">Any Rating</option>
                        <option value="1">1 Star & Up</option>
                        <option value="2">2 Stars & Up</option>
                        <option value="3">3 Stars & Up</option>
                        <option value="4">4 Stars & Up</option>
                        <option value="5">5 Stars</option>
                    </select>
                </div>
            </div>
            <div class="mt-6 flex justify-between items-center">
                 <button @click="clearFilters" class="px-4 py-2 text-sm font-medium text-flavorpal-orange hover:text-flavorpal-orange-dark transition-colors">
                    Clear Filters
                </button>
                <div class="space-x-3">
                    <button @click="showFilterModal = false" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                        Cancel
                    </button>
                    <button @click="applyFilters" class="px-4 py-2 text-sm font-medium text-white bg-flavorpal-green hover:bg-flavorpal-green-dark rounded-lg transition-colors">
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

// --- Reactive State Variables ---
const searchQuery = ref<string>(''); // For text search
const viewMode = ref<'list' | 'grid'>('list'); // To toggle between list and grid views
const showFilterModal = ref<boolean>(false); // To control visibility of the filter modal

// --- Filter State ---
// These hold the currently applied filter values
const selectedDateFilter = ref<string>(''); // Stores the selected date string (YYYY-MM-DD)
const selectedMinRating = ref<number>(0);   // Stores the selected minimum rating (0 means no rating filter)

// Temporary state for modal inputs, applied on "Apply Filters"
const tempSelectedDate = ref<string>('');
const tempSelectedMinRating = ref<number>(0);


const router = useRouter(); // Vue router instance

// Interface defining the structure of a history item
interface HistoryItem {
  id: string;
  name: string;
  imageUrl?: string;
  rating: number;
  notes: string;
  dateScanned: string; // Expected format: "Month Day, Year" e.g., "May 10, 2025"
}

// Array to store all history items (mocked for now)
const allHistoryItems = ref<HistoryItem[]>([]);

// --- Mock Data Fetching ---
const fetchHistoryItems = () => {
  setTimeout(() => {
    allHistoryItems.value = [
      { id: 'hist001', name: 'Gourmet Coffee Beans', imageUrl: 'https://placehold.co/200x200/6B4F4F/FFFFFF?text=Coffee&font=roboto', rating: 4.5, notes: 'Excellent aroma, smooth taste. A bit pricey but worth it for special occasions. Roasted in small batches.', dateScanned: 'May 10, 2025' },
      { id: 'hist002', name: 'Artisanal Sourdough Bread', imageUrl: 'https://placehold.co/200x200/D1C0A8/FFFFFF?text=Bread&font=roboto', rating: 5, notes: 'Perfect crust and a tangy flavor. Made with organic flour. Best sourdough I have had in ages!', dateScanned: 'May 08, 2025' },
      { id: 'hist003', name: 'Imported Olive Oil (Extra Virgin)', imageUrl: 'https://placehold.co/200x200/A3B18A/FFFFFF?text=OliveOil&font=roboto', rating: 4, notes: 'Good quality, fruity notes. Used it for salads and cooking. The bottle design is also very nice.', dateScanned: 'May 05, 2025' },
      { id: 'hist004', name: 'Organic Green Tea Bags', imageUrl: 'https://placehold.co/200x200/84A98C/FFFFFF?text=Tea&font=roboto', rating: 3.5, notes: 'Decent flavor, but not as vibrant as loose leaf. Convenient for a quick cup.', dateScanned: 'May 02, 2025' },
      { id: 'hist005', name: 'Craft IPA Beer (Local Brewery)', imageUrl: 'https://placehold.co/200x200/F4A261/FFFFFF?text=IPA&font=roboto', rating: 4.8, notes: 'Hoppy and citrusy, a fantastic IPA. Will definitely buy again from this local brewery. Great find!', dateScanned: 'Apr 28, 2025' },
      { id: 'hist006', name: 'Aged Cheddar Cheese', imageUrl: 'https://placehold.co/200x200/E9C46A/FFFFFF?text=Cheese&font=roboto', rating: 4.2, notes: 'Sharp and crumbly, very flavorful. Paired well with the sourdough bread and some apple slices.', dateScanned: 'Apr 25, 2025' },
    ];
  }, 500);
};

// Fetch items when the component is mounted
onMounted(() => {
  fetchHistoryItems();
});

// --- Computed Properties for Filtering and Display ---
// This computed property processes search and filters
const processedHistoryItems = computed(() => {
  let items = allHistoryItems.value;

  // 1. Filter by search query (name or notes)
  if (searchQuery.value.trim()) {
    const lowerCaseQuery = searchQuery.value.toLowerCase();
    items = items.filter(item =>
      item.name.toLowerCase().includes(lowerCaseQuery) ||
      item.notes.toLowerCase().includes(lowerCaseQuery)
    );
  }

  // 2. Filter by minimum rating
  if (selectedMinRating.value > 0) {
    items = items.filter(item => item.rating >= selectedMinRating.value);
  }

  // 3. Filter by date (scanned on or after the selected date)
  if (selectedDateFilter.value) {
    try {
      // Convert selected filter date to a Date object (start of that day)
      const filterDate = new Date(selectedDateFilter.value);
      filterDate.setHours(0, 0, 0, 0); // Normalize to start of day for comparison

      items = items.filter(item => {
        // Convert item's dateScanned string to a Date object
        const itemDate = new Date(item.dateScanned);
        itemDate.setHours(0,0,0,0); // Normalize for fair comparison
        return itemDate >= filterDate;
      });
    } catch (e) {
        console.error("Error parsing date for filtering:", e);
        // Optionally handle date parsing errors, e.g., by not applying date filter
    }
  }
  return items;
});

// Computed property to count active filters for display on filter button
const activeFilterCount = computed(() => {
    let count = 0;
    if (selectedDateFilter.value) count++;
    if (selectedMinRating.value > 0) count++;
    return count;
});

// --- Event Handlers ---
const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'list' ? 'grid' : 'list';
};

const toggleFilterModal = () => {
  // When opening modal, sync temp filters with current active filters
  if (!showFilterModal.value) {
    tempSelectedDate.value = selectedDateFilter.value;
    tempSelectedMinRating.value = selectedMinRating.value;
  }
  showFilterModal.value = !showFilterModal.value;
};

const applyFilters = () => {
  selectedDateFilter.value = tempSelectedDate.value;
  selectedMinRating.value = tempSelectedMinRating.value;
  showFilterModal.value = false; // Close modal after applying
};

const clearFilters = () => {
    // Clear temporary values in modal
    tempSelectedDate.value = '';
    tempSelectedMinRating.value = 0;
    // Clear active filters
    selectedDateFilter.value = '';
    selectedMinRating.value = 0;
    showFilterModal.value = false; // Close modal
};

const viewItemDetail = (itemId: string) => {
  console.log('Navigate to detail for history item:', itemId);
  router.push({ name: 'ProductDetail', params: { id: itemId } }); // Future implementation
};
</script>

<style scoped>
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
/* Styles for filter modal transition (backdrop and content) */
.fixed.inset-0.bg-black.bg-opacity-75 {
    transition: opacity 0.3s ease-in-out;
}
.fixed.inset-0.bg-black.bg-opacity-75 > div {
    transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
}
</style>
