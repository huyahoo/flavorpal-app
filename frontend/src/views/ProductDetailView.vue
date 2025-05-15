<template>
  <div class="flex flex-col min-h-full bg-flavorpal-gray-light">
    <header class="sticky top-0 z-30 bg-flavorpal-gray-light p-4 shadow-sm flex items-center">
      <button @click="goBack" class="text-flavorpal-green hover:text-flavorpal-green-dark p-2 -ml-2 rounded-full" aria-label="Go back">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
      </button>
      <h1 class="text-xl font-semibold text-flavorpal-gray-dark ml-2 truncate">{{ product?.name || 'Product Details' }}</h1>
    </header>

    <main class="flex-grow p-4 sm:p-6 space-y-6">
      <div v-if="loading" class="text-center py-10">
        <svg class="animate-spin h-8 w-8 text-flavorpal-green mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-flavorpal-gray">Loading product details...</p>
      </div>
      <div v-else-if="product" class="space-y-6">
        <section class="bg-white p-5 rounded-xl shadow-lg">
          <h2 class="text-2xl sm:text-3xl font-bold text-flavorpal-gray-dark mb-2">{{ product.name }}</h2>
          <div class="flex items-center">
            <svg v-for="star in 5" :key="`main-star-${star}`" class="w-5 h-5 sm:w-6 sm:h-6" :class="star <= product.rating ? 'text-yellow-400' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
            <span class="ml-2 text-sm text-gray-600">({{ product.rating.toFixed(1) }} stars)</span>
          </div>
           <div class="mt-3 text-xs text-gray-400">
            Reviewed on: {{ product.dateScanned }}
          </div>
        </section>

        <section class="bg-white p-5 rounded-xl shadow-lg">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-lg font-semibold text-flavorpal-gray-dark">Notes</h3>
            <button @click="editNotes" class="text-sm text-flavorpal-green hover:text-flavorpal-green-dark font-medium flex items-center p-1 rounded hover:bg-flavorpal-green-light transition-colors">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
              EDIT
            </button>
          </div>
          <p class="text-flavorpal-gray text-sm leading-relaxed whitespace-pre-wrap">{{ product.notes }}</p>
        </section>

        <section class="bg-white p-5 rounded-xl shadow-lg">
          <h3 class="text-lg font-semibold text-flavorpal-gray-dark mb-3">Is this a new product?</h3>
          <div class="flex space-x-3">
            <button 
              @click="markAsNewProduct(true)"
              :class="product.isNew === true ? 'bg-flavorpal-green text-white ring-2 ring-offset-1 ring-flavorpal-green-dark' : 'bg-gray-100 hover:bg-gray-200 text-flavorpal-gray-dark'"
              class="flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-150 ease-in-out"
              aria-pressed="product.isNew === true"
            >
              Yes
            </button>
            <button 
              @click="markAsNewProduct(false)"
              :class="product.isNew === false ? 'bg-flavorpal-green text-white ring-2 ring-offset-1 ring-flavorpal-green-dark' : 'bg-gray-100 hover:bg-gray-200 text-flavorpal-gray-dark'"
              class="flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-150 ease-in-out"
              aria-pressed="product.isNew === false"
            >
              No
            </button>
          </div>
        </section>

        <section class="bg-white p-5 rounded-xl shadow-lg">
          <h3 class="text-lg font-semibold text-flavorpal-gray-dark mb-4">Related Products</h3>
          <div v-if="relatedProducts.length > 0" class="space-y-3">
            <div 
              v-for="related in relatedProducts" 
              :key="related.id"
              class="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              @click="viewItemDetail(related.id)"
              role="button"
              tabindex="0"
              @keypress.enter="viewItemDetail(related.id)"
              :aria-label="`View details for ${related.name}`"
            >
              <div class="flex-shrink-0 w-12 h-12 bg-flavorpal-gray-light rounded-full flex items-center justify-center mr-3 overflow-hidden">
                 <img v-if="related.imageUrl" :src="related.imageUrl" :alt="related.name" class="w-full h-full object-cover" onerror="this.style.display='none'; this.nextSibling.style.display='flex';"/>
                 <svg v-else class="w-6 h-6 text-gray-400" style="display:flex;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </div>
              <div class="min-w-0">
                <p class="font-medium text-sm text-flavorpal-gray-dark truncate">{{ related.name }}</p>
                <div class="flex items-center mt-0.5">
                    <svg v-for="star in 5" :key="`related-star-${related.id}-${star}`" class="w-3.5 h-3.5" :class="star <= related.rating ? 'text-yellow-400' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                </div>
              </div>
            </div>
          </div>
          <p v-else class="text-sm text-flavorpal-gray">No related products found.</p>
        </section>
      </div>
      <div v-else-if="!loading && !product" class="text-center py-10">
        <svg class="w-16 h-16 text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 14a1 1 0 11-2 0 1 1 0 012 0zm6 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg>
        <p class="text-xl text-flavorpal-gray-dark">Product Not Found</p>
        <p class="text-flavorpal-gray mt-1">We couldn't find details for this product.</p>
        <router-link to="/history" class="mt-6 inline-block text-flavorpal-green hover:underline font-medium px-4 py-2 rounded-lg hover:bg-flavorpal-green-light transition-colors">
            Go back to History
        </router-link>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// Import necessary functions from Vue and Vue Router
import { ref, onMounted, computed, watch } from 'vue'; // Added 'watch'
import { useRoute, useRouter } from 'vue-router';

// Define the structure for product details
interface ProductDetail {
  id: string;
  name: string;
  imageUrl?: string;
  rating: number;
  notes: string;
  dateScanned: string;
  isNew?: boolean; // Tracks if the user marked this as a new product
}

// Define the structure for related products (simplified)
interface RelatedProduct {
    id: string;
    name: string;
    imageUrl?: string;
    rating: number;
}

// Define component props, expecting an 'id' from the route parameters
const props = defineProps<{
  id: string; 
}>();

const route = useRoute(); // Access current route information
const router = useRouter(); // Access router instance for navigation

// Reactive state variables for the component
const product = ref<ProductDetail | null>(null); // Holds the fetched product details
const relatedProducts = ref<RelatedProduct[]>([]); // Holds related products
const loading = ref<boolean>(true); // Loading state indicator

// Mock function to simulate fetching product details by ID
const fetchProductDetails = async (productId: string) => {
  loading.value = true; // Set loading to true before fetching
  console.log(`Fetching details for product ID: ${productId}`);
  
  // Simulate an API call delay
  await new Promise(resolve => setTimeout(resolve, 700));

  // Mock data store - in a real app, this would be an API call
  const allMockProducts: ProductDetail[] = [
    { id: 'hist001', name: 'Gourmet Coffee Beans', imageUrl: 'https://placehold.co/400x300/6B4F4F/FFFFFF?text=Coffee&font=roboto', rating: 4.5, notes: 'Excellent aroma, smooth taste. A bit pricey but worth it for special occasions. Roasted in small batches. \n\nWould buy again if on sale. Pairs well with dark chocolate.', dateScanned: 'May 10, 2025', isNew: false },
    { id: 'hist002', name: 'Artisanal Sourdough Bread', imageUrl: 'https://placehold.co/400x300/D1C0A8/FFFFFF?text=Bread&font=roboto', rating: 5, notes: 'Perfect crust and a tangy flavor. Made with organic flour. Best sourdough I have had in ages! \n\nGreat for sandwiches or just with butter.', dateScanned: 'May 08, 2025', isNew: true },
    { id: 'hist003', name: 'Imported Olive Oil (Extra Virgin)', imageUrl: 'https://placehold.co/400x300/A3B18A/FFFFFF?text=OliveOil&font=roboto', rating: 4, notes: 'Good quality, fruity notes. Used it for salads and cooking. The bottle design is also very nice.', dateScanned: 'May 05, 2025', isNew: false },
    { id: 'hist004', name: 'Organic Green Tea Bags', imageUrl: 'https://placehold.co/400x300/84A98C/FFFFFF?text=Tea&font=roboto', rating: 3.5, notes: 'Decent flavor, but not as vibrant as loose leaf. Convenient for a quick cup.', dateScanned: 'May 02, 2025', isNew: undefined },
    { id: 'hist005', name: 'Craft IPA Beer (Local Brewery)', imageUrl: 'https://placehold.co/400x300/F4A261/FFFFFF?text=IPA&font=roboto', rating: 4.8, notes: 'Hoppy and citrusy, a fantastic IPA. Will definitely buy again from this local brewery. Great find!', dateScanned: 'Apr 28, 2025', isNew: true },
    { id: 'hist006', name: 'Aged Cheddar Cheese', imageUrl: 'https://placehold.co/400x300/E9C46A/FFFFFF?text=Cheese&font=roboto', rating: 4.2, notes: 'Sharp and crumbly, very flavorful. Paired well with the sourdough bread and some apple slices.', dateScanned: 'Apr 25, 2025', isNew: false },
  ];

  // Find the product in the mock data
  const foundProduct = allMockProducts.find(p => p.id === productId);
  if (foundProduct) {
    product.value = { ...foundProduct }; // Assign a copy to the reactive variable
    // Mock related products: filter out the current product and take a few examples
    relatedProducts.value = allMockProducts
        .filter(p => p.id !== productId) // Exclude the current product
        .slice(0, 2) // Take the first 2 as examples
        .map(p => ({ id: p.id, name: p.name, imageUrl: p.imageUrl, rating: p.rating })); // Map to RelatedProduct structure
  } else {
    product.value = null; // Product not found
    relatedProducts.value = [];
    console.warn(`Product with ID ${productId} not found in mock data.`);
  }
  loading.value = false; // Set loading to false after fetching
};

// Fetch product details when the component is first mounted
onMounted(() => {
  fetchProductDetails(props.id);
});

// Watch for changes in the 'id' prop (e.g., if navigating from one product detail to another via related products)
// If the ID changes, refetch the product details.
watch(() => props.id, (newId) => {
  if (newId) { // Ensure newId is valid before fetching
    fetchProductDetails(newId);
  }
});

// Function to navigate back
const goBack = () => {
  // Check if there's a previous page in the browser's history to go back to
  if (window.history.length > 2) { 
    router.go(-1); // Go back one step in history
  } else {
    // If no significant history, navigate to a default fallback route (e.g., 'History' or 'Home')
    router.push({ name: 'History' }); 
  }
};

// Placeholder function for editing notes
const editNotes = () => {
  console.log('Edit notes for product:', product.value?.id);
  // In a real app, this would navigate to an edit screen or open an inline editing UI.
  // Example: router.push({ name: 'EditReview', params: { id: product.value?.id } });
  alert('Edit functionality to be implemented!');
};

// Function to mark the product as new or not
const markAsNewProduct = (isNewStatus: boolean) => {
  if (product.value) {
    product.value.isNew = isNewStatus; // Update the local state
    console.log(`Product ${product.value.id} marked as new: ${isNewStatus}`);
    // In a real application, this change would be saved to a backend or persistent store.
  }
};

// Function to view details of a related product
const viewItemDetail = (itemId: string) => {
  // Navigate to the ProductDetail route for the selected related item
  router.push({ name: 'ProductDetail', params: { id: itemId } });
};

</script>

<style scoped>
/* Scoped styles specific to this component */
.whitespace-pre-wrap {
  /* Ensures that newline characters (\n) in the notes string are rendered as line breaks */
  white-space: pre-wrap; 
}
</style>
