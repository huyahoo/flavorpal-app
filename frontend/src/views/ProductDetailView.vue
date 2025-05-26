<template>
  <div class="flex flex-col min-h-full bg-flavorpal-gray-light">
    <header class="sticky top-0 z-30 bg-flavorpal-gray-light p-4 shadow-sm flex items-center">
      <button @click="goBack" class="text-flavorpal-green hover:text-flavorpal-green-dark p-2 -ml-2 rounded-full" aria-label="Go back">
        <IconArrowBack />
      </button>
      <h1 class="text-xl font-semibold text-flavorpal-gray-dark ml-2 truncate">
        {{ previousRouteName || 'Back' }}
      </h1>
      </header>

    <main class="flex-grow p-4 sm:p-6 space-y-6">
      <div v-if="loadingProduct" class="text-center py-10">
        <svg class="animate-spin h-8 w-8 text-flavorpal-green mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-flavorpal-gray">Loading product details...</p>
      </div>

      <div v-else-if="product" class="space-y-6">
        <section class="bg-white p-5 rounded-xl shadow-lg">
          <h2 class="text-2xl sm:text-3xl font-bold text-flavorpal-gray-dark mb-3">{{ product.name }}</h2>
          <div class="mb-4 relative w-full aspect-[16/9] bg-flavorpal-gray-light rounded-lg overflow-hidden flex items-center justify-center">
              <div
                v-if="product.isReviewed"
                class="absolute top-0 left-0 z-10"
                aria-label="Item has been reviewed"
              >
                <div class="w-24 h-24 overflow-hidden">
                  <div class="absolute transform -rotate-45 bg-flavorpal-green text-white text-center shadow-md"
                    style="left: -30px; top: 12px; width: 110px; font-size: 0.7rem; padding: 2px 0;"
                    >
                    Reviewed
                  </div>
                </div>
              </div>
              <img
                v-if="product.imageUrl"
                :src="product.imageUrl"
                :alt="product.name"
                class="w-full h-full object-contain"
                onerror="this.style.display='none'; this.nextSibling.style.display='flex';"
              />
              <svg
                v-else
                class="w-16 h-16 text-gray-400"
                style="display: flex;"
                fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          </div>

          <div v-if="product.isReviewed">
            <div class="flex items-center mb-1">
              <StarRating v-if="typeof product.userRating === 'number'" :rating="product.userRating" starSize="w-5 h-5 sm:w-6 sm:h-6"/>
              <span v-if="typeof product.userRating === 'number'" class="ml-2 text-sm text-gray-600">({{ product.userRating.toFixed(1) }} stars)</span>
            </div>
            <p v-if="product.dateReviewed" class="text-xs text-gray-500">
              Reviewed on: {{ product.dateReviewed }}
            </p>
          </div>
          <div v-else>
             <p class="text-xs text-gray-500">
              Scanned on: {{ product.dateScanned }}
            </p>
          </div>
        </section>

        <section v-if="product.isReviewed" class="bg-white p-5 rounded-xl shadow-lg">
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-lg font-semibold text-flavorpal-gray-dark">Your Notes</h3>
            <button @click="editNotes" class="text-sm text-flavorpal-green hover:text-flavorpal-green-dark font-medium flex items-center p-1 rounded hover:bg-flavorpal-green-light transition-colors">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
              EDIT
            </button>
          </div>
          <p class="text-flavorpal-gray text-sm leading-relaxed whitespace-pre-wrap">{{ product.userNotes || 'No notes added yet.' }}</p>
        </section>

        <section v-if="product.aiHealthSummary || product.aiHealthConclusion" class="bg-white p-5 rounded-xl shadow-lg">
            <h3 class="text-lg font-semibold text-flavorpal-gray-dark mb-2">Health Insights</h3>
            <p v-if="product.aiHealthSummary" class="text-flavorpal-gray text-sm leading-relaxed mb-3">
                {{ product.aiHealthSummary }}
            </p>
            <div v-if="product.aiHealthConclusion" class="flex items-center">
                <span
                class="w-3 h-3 rounded-full mr-1.5 flex-shrink-0"
                :class="getConclusionColor(product.aiHealthConclusion)"
                aria-hidden="true"
                ></span>
                <span class="text-sm font-medium" :class="getConclusionTextColor(product.aiHealthConclusion)">
                {{ getConclusionText(product.aiHealthConclusion) }}
                </span>
            </div>
        </section>

        <section class="mt-6">
            <button
                v-if="!product.isReviewed"
                @click="navigateToAddReview"
                class="w-full flex items-center justify-center bg-flavorpal-orange hover:bg-flavorpal-orange-dark text-white font-semibold py-3 px-4 mb-3 rounded-xl text-base transition-colors duration-150 ease-in-out shadow-md hover:shadow-lg active:scale-95"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
              Add Review
            </button>

            <button
              @click="openDeleteConfirmModal"
              class="w-full flex items-center justify-center py-3 px-4 bg-flavorpal-red hover:bg-flavorpal-red-dark text-white font-medium rounded-xl transition-colors duration-150 ease-in-out"
              aria-label="Delete this product interaction"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              Delete
            </button>
        </section>

        <section v-if="!product.isReviewed" class="bg-white p-5 rounded-xl shadow-lg">
          <h3 class="text-lg font-semibold text-flavorpal-gray-dark mb-3">Is this a new product for you?</h3>
          <div class="flex space-x-3">
            <button
              @click="markAsNewProductUserChoice(true)"
              :class="product.isNewForUser === true ? 'bg-flavorpal-green text-white ring-2 ring-offset-1 ring-flavorpal-green-dark' : 'bg-gray-100 hover:bg-gray-200 text-flavorpal-gray-dark'"
              class="flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-150 ease-in-out"
              :aria-pressed="product.isNewForUser === true"
            >
              Yes, first time trying!
            </button>
            <button
              @click="markAsNewProductUserChoice(false)"
              :class="product.isNewForUser === false ? 'bg-flavorpal-green text-white ring-2 ring-offset-1 ring-flavorpal-green-dark' : 'bg-gray-100 hover:bg-gray-200 text-flavorpal-gray-dark'"
              class="flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-150 ease-in-out"
              :aria-pressed="product.isNewForUser === false"
            >
              No, I've had it before
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
              @click="related.id ? viewRelatedItemDetail(related.id) : null"
              role="button" tabindex="0"
              @keypress.enter="related.id ? viewRelatedItemDetail(related.id) : null"
              :aria-label="`View details for ${related.name}`"
            >
              <div class="flex-shrink-0 w-12 h-12 bg-flavorpal-gray-light rounded-full flex items-center justify-center mr-3 overflow-hidden">
                 <img v-if="related.imageUrl" :src="related.imageUrl" :alt="related.name" class="w-full h-full object-cover" onerror="this.style.display='none'; this.nextSibling.style.display='flex';"/>
                 <svg v-else class="w-6 h-6 text-gray-400" style="display:flex;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </div>
              <div class="min-w-0">
                <p class="font-medium text-sm text-flavorpal-gray-dark truncate">{{ related.name }}</p>
                <StarRating v-if="related.isReviewed && typeof related.userRating === 'number'" :rating="related.userRating" starSize="w-3.5 h-3.5" class="mt-0.5"/>
              </div>
            </div>
          </div>
          <p v-else class="text-sm text-flavorpal-gray">No related products found.</p>
        </section>
      </div>
      <div v-else-if="!loadingProduct && !product" class="text-center py-10">
        <svg class="w-16 h-16 text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 14a1 1 0 11-2 0 1 1 0 012 0zm6 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg>
        <p class="text-xl text-flavorpal-gray-dark">Product Not Found</p>
        <p class="text-flavorpal-gray mt-1">We couldn't find details for this product ID ({{ id }}).</p>
        <router-link to="/history" class="mt-6 inline-block text-flavorpal-green hover:underline font-medium px-4 py-2 rounded-lg hover:bg-flavorpal-green-light transition-colors">
            Go back to History
        </router-link>
      </div>
      <ConfirmationModal
        :is-open="showDeleteConfirmModal"
        title="Confirm Deletion"
        :message="`Are you sure you want to delete your history for '${product?.name || 'this item'}'? This action cannot be undone.`"
        @confirm="executeDelete"
        @cancel="showDeleteConfirmModal = false"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
// ... (imports remain the same as flavorpal_product_detail_view_v3_final)
import { ref, onMounted, computed, watch, onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useHistoryStore } from '../store/historyStore';
import type { ProductInteraction, AiHealthConclusion } from '../types';
import StarRating from '@/components/common/StarRating.vue';
import ConfirmationModal from '@/components/common/ConfirmationModal.vue';
import IconArrowBack from '@/components/icons/IconArrowBack.vue';

const props = defineProps<{
  id: string;
}>();

const router = useRouter();
const route = useRoute();
const historyStore = useHistoryStore();

const product = ref<(ProductInteraction & { isNewForUser?: boolean }) | null>(null);
const relatedProducts = ref<Partial<ProductInteraction & {isReviewed?: boolean, id?: string}>[]>([]);
const loadingProduct = ref<boolean>(true);
const previousRouteName = ref<string | null>(null);

const showDeleteConfirmModal = ref(false);

const loadProductData = async (productId: string) => {
  loadingProduct.value = true;
  if (historyStore.allProductInteractions.length === 0 && !historyStore.loadingInteractions) {
    await historyStore.loadProductInteractions();
  }

  const foundProduct = historyStore.getProductInteractionById(productId);

  if (foundProduct) {
    product.value = {
        ...foundProduct,
        isNewForUser: (foundProduct as any).isNewForUser === undefined ? undefined : (foundProduct as any).isNewForUser
    };

    relatedProducts.value = historyStore.allProductInteractions
        .filter(p => p.id !== productId && p.name !== foundProduct.name)
        .slice(0, 2)
        .map(p => ({ id: p.id, name: p.name, imageUrl: p.imageUrl, userRating: p.userRating, isReviewed: p.isReviewed }));
  } else {
    product.value = null;
    relatedProducts.value = [];
  }
  loadingProduct.value = false;
};

onBeforeMount(() => {
    const fromPath = router.options.history.state.back as string | null;
    if (fromPath) {
        const fromRouteResolved = router.resolve(fromPath);
        if (fromRouteResolved && fromRouteResolved.meta.title) {
            previousRouteName.value = fromRouteResolved.meta.title.toString().replace('FlavorPal - ', '');
        } else if (fromRouteResolved && fromRouteResolved.name) {
            const nameStr = fromRouteResolved.name.toString();
            previousRouteName.value = nameStr.charAt(0).toUpperCase() + nameStr.slice(1);
        }
    }
    if (!previousRouteName.value && route.query.fromTitle) {
        previousRouteName.value = route.query.fromTitle as string;
    }
});


onMounted(() => {
  loadProductData(props.id);
});

watch(() => props.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    loadProductData(newId);
    const fromPath = router.options.history.state.back as string | null;
    if (fromPath) {
        const fromRouteResolved = router.resolve(fromPath);
        if (fromRouteResolved && fromRouteResolved.meta.title) {
            previousRouteName.value = fromRouteResolved.meta.title.toString().replace('FlavorPal - ', '');
        }  else if (fromRouteResolved && fromRouteResolved.name) {
            const nameStr = fromRouteResolved.name.toString();
            previousRouteName.value = nameStr.charAt(0).toUpperCase() + nameStr.slice(1);
        } else {
            previousRouteName.value = null;
        }
    } else {
        previousRouteName.value = null;
    }
  }
});

const goBack = () => {
  if (window.history.state.back) {
    router.go(-1);
  } else {
    router.push({ name: 'History' });
  }
};

const editNotes = () => {
  if (!product.value) return;
  router.push({ name: 'AddReview', query: { editProductId: product.value.id, fromTitle: previousRouteName.value || 'Details' } });
};

const navigateToAddReview = () => {
    if (!product.value) return;
    router.push({ name: 'AddReview', query: { scanId: product.value.id, productName: product.value.name, fromTitle: previousRouteName.value || 'Details' } });
};

const markAsNewProductUserChoice = (isNew: boolean) => {
  // if (product.value) {
  //   const updatedProduct = { ...product.value, isNewForUser: isNew };
  //   product.value = updatedProduct;
  //   historyStore.updateProductInteraction(updatedProduct);
  // }
};

const viewRelatedItemDetail = (itemId: string) => {
  router.push({ name: 'ProductDetail', params: { id: itemId } });
};

const executeDelete = async () => {
    if (!product.value) return;
    const success = await historyStore.deleteProductInteraction(product.value.id);
    showDeleteConfirmModal.value = false; // Close modal
    if (success) {
        // alert(`"${product.value.name}" has been removed from your history.`);
        router.push({ name: 'History' });
    } else {
        alert(`Failed to delete "${product.value.name}". ${historyStore.error || ''}`);
    }
};

const openDeleteConfirmModal = () => {
    if (!product.value) return;
    showDeleteConfirmModal.value = true;
};

// --- AI Conclusion Styling Helpers (remain the same) ---
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

<style scoped>
.whitespace-pre-wrap {
  white-space: pre-wrap;
}
.aspect-\[16\/9\] {
  aspect-ratio: 16 / 9;
}
</style>
