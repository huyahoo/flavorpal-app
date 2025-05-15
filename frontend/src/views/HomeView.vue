<template>
  <div class="flex flex-col min-h-full bg-flavorpal-gray-light">
    <header class="bg-flavorpal-green text-white p-6 pt-8 sm:p-8 rounded-b-3xl shadow-lg">
      <div class="text-center">
        <p v-if="username" class="text-lg opacity-90">
          {{ username }}, you have discovered
        </p>
        <p v-else class="text-lg opacity-90">You have discovered</p>
        
        <div class="my-2 sm:my-3">
          <span class="text-7xl sm:text-8xl font-bold tracking-tighter">{{ discoveredProductsThisMonth }}</span>
        </div>
        
        <p class="text-base opacity-90 leading-tight">
          new products this month,
          <br />from scanning a total of
        </p>
        
        <div class="my-1 sm:my-2">
          <span class="text-4xl sm:text-5xl font-semibold">{{ totalScannedProducts }}</span>
          <span class="text-3xl sm:text-4xl font-light opacity-80 ml-1">products</span>
        </div>
      </div>
    </header>

    <main class="flex-grow p-4 sm:p-6 -mt-8 z-10"> <section class="bg-white p-5 rounded-xl shadow-xl mb-8">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-flavorpal-gray-dark">Recently Scanned</h2>
          <router-link 
            to="/history" 
            class="text-sm text-flavorpal-green hover:text-flavorpal-green-dark font-medium transition-colors"
            aria-label="View all scanned items history"
          >
            See More
          </router-link>
        </div>

        <div v-if="recentItems.length > 0" class="space-y-4">
          <div
            v-for="item in recentItems"
            :key="item.id"
            class="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-200 ease-in-out cursor-pointer hover:shadow-md"
            @click="viewItemDetail(item.id)"
            role="button"
            tabindex="0"
            @keypress.enter="viewItemDetail(item.id)"
          >
            <div class="flex-shrink-0 w-14 h-14 bg-flavorpal-gray-light rounded-full flex items-center justify-center mr-4 shadow-sm overflow-hidden">
              <img 
                v-if="item.imageUrl" 
                :src="item.imageUrl" 
                :alt="item.name" 
                class="w-full h-full object-cover"
                onerror="this.style.display='none'; this.nextSibling.style.display='flex';"
              />
              <svg 
                v-else 
                class="w-8 h-8 text-flavorpal-gray" 
                style="display: flex;"
                fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <div class="flex-grow min-w-0"> <h3 class="font-semibold text-flavorpal-gray-dark truncate">{{ item.name }}</h3>
              <div class="flex items-center mt-0.5">
                <svg v-for="star in 5" :key="star" class="w-4 h-4" :class="star <= item.rating ? 'text-yellow-400' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                 <span class="ml-1.5 text-xs text-gray-500">({{ item.rating.toFixed(1) }})</span>
              </div>
              <p class="text-xs text-flavorpal-gray mt-1 truncate">{{ item.notesSnippet }}</p>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8">
          <svg class="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
          <p class="text-flavorpal-gray font-medium">No recently scanned items.</p>
          <p class="text-sm text-flavorpal-gray mt-1">Start scanning products to see them here!</p>
        </div>
      </section>

      <section class="bg-white p-5 rounded-xl shadow-xl">
        <h2 class="text-xl font-semibold text-flavorpal-gray-dark mb-4">Discover New Flavors</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="bg-flavorpal-orange-light p-4 rounded-lg text-center hover:shadow-md transition-shadow cursor-pointer">
            <p class="font-semibold text-flavorpal-orange-dark">Trending Snacks</p>
            <p class="text-xs text-flavorpal-orange-dark opacity-80 mt-1">Find what's popular!</p>
          </div>
          <div class="bg-flavorpal-green-light p-4 rounded-lg text-center hover:shadow-md transition-shadow cursor-pointer">
            <p class="font-semibold text-flavorpal-green-dark">Local Delicacies</p>
            <p class="text-xs text-flavorpal-green-dark opacity-80 mt-1">Explore regional tastes.</p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../store/auth'; // Import the authentication store
import { useRouter } from 'vue-router'; // Import router for navigation

const authStore = useAuthStore();
const router = useRouter();

// --- Mock Data (Replace with actual data from your store/API later) ---
// These would typically be fetched or derived from user activity.
const discoveredProductsThisMonth = ref(0); 
const totalScannedProducts = ref(0);

// Interface for a recently scanned item
interface RecentItem {
  id: string;
  name: string;
  imageUrl?: string; // Optional: URL for the product image
  rating: number;    // Star rating (e.g., 1-5)
  notesSnippet: string; // A short snippet of user notes
}

// Reactive array to hold recently scanned items
const recentItems = ref<RecentItem[]>([]);

// Function to simulate fetching recent items (replace with actual logic)
const fetchRecentItems = () => {
  // Simulate an API call or store retrieval
  setTimeout(() => {
    // Example mock data
    recentItems.value = [
      { id: 'prod101', name: 'Artisan Dark Chocolate (70%)', imageUrl: 'https://placehold.co/100x100/4A3A3A/FFFFFF?text=Choco&font=roboto', rating: 5, notesSnippet: 'Rich dark chocolate with a hint of sea salt. Absolutely divine!' },
      { id: 'prod102', name: 'Spicy Mango Chutney Deluxe', imageUrl: 'https://placehold.co/100x100/F59E0B/FFFFFF?text=Chutney&font=roboto', rating: 4, notesSnippet: 'Great kick, perfect with cheese and crackers. A bit too sweet for daily use.' },
      { id: 'prod103', name: 'Organic Ginger Kombucha Fizz', imageUrl: 'https://placehold.co/100x100/34D399/FFFFFF?text=Kombucha&font=roboto', rating: 3.5, notesSnippet: 'Refreshing, but the ginger flavor could be stronger for my taste.' },
    ];
    // Update stats based on fetched items (example)
    discoveredProductsThisMonth.value = recentItems.value.length; // Simple example
    totalScannedProducts.value = recentItems.value.length + 5; // Example
  }, 1000); // Simulate 1 second delay
};

// Call fetchRecentItems when the component is mounted
onMounted(() => {
  fetchRecentItems();
});
// --- End Mock Data & Fetching ---

// Computed property to get the username part from the email for display
const username = computed(() => {
  if (authStore.user?.email) {
    // Takes the part of the email before the "@" symbol
    return authStore.user.email.split('@')[0];
  }
  return null; // Fallback if no user or email
});

// Function to handle navigation to an item's detail page (placeholder)
const viewItemDetail = (itemId: string) => {
  console.log('Navigate to detail for item:', itemId);
  // Example navigation: router.push({ name: 'ProductDetail', params: { id: itemId } });
  // You'll need to define a 'ProductDetail' route and view for this.
};
</script>

<style scoped>
/* Scoped styles specific to this HomeView component.
  This ensures that the view takes up at least the height of the viewport,
  minus the approximate height of the bottom navigation bar if it's present.
  This helps in layouts where content might be short.
*/
.min-h-full {
  /* The 'pb-16' class is applied to the main content area in App.vue when bottom nav is shown.
    This calculation is a fallback or can be used if App.vue structure changes.
    Typically, letting flexbox handle height (`flex-grow` on main content) is preferred.
  */
  /* min-height: calc(100vh - 4rem); */ /* Adjust '4rem' based on actual bottom nav height */
}
</style>
