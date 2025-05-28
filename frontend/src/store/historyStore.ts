// src/store/historyStore.ts
import { defineStore } from 'pinia';
import type { ProductInteraction, AiHealthConclusion, ReViewDataPayload } from '../types';
import { fetchProductInteractionsApi, fetchScanStatisticsApi } from '../services/historyService';
import { getAllProductsApi, getProductByIdApi, addReviewForProductApi, updateReviewForProductApi, deleteProductByIdApi, getProductHealthInsightApi } from '../services/productService';
import type { CapturedPhoto } from '@/views/Scan/components/PhotoCapturer.vue';

export type ReviewedFilterStatus = 'all' | 'reviewed_only' | 'scanned_only';

export interface HistoryFilters {
  dateAfter?: string;
  reviewedStatus?: ReviewedFilterStatus;
  minRating?: number;
  aiConclusion?: AiHealthConclusion | '';
}

export interface ReviewDataPayload {
  productIdToUpdate?: string;
  productName: string;
  userRating: number;
  userNotes: string;
  imageUrl?: string;
  barcode?: string;
  aiHealthSummary?: string;
  aiHealthConclusion?: AiHealthConclusion;
}

export interface HistoryStoreState {
  allProductInteractions: ProductInteraction[];
  discoveredThisMonth: number;
  totalScanned: number;
  loadingStats: boolean;
  filterSearchQuery: string;
  filterDateAfter: string;
  filterReviewedStatus: ReviewedFilterStatus;
  filterMinRating: number;
  filterAiConclusion?: AiHealthConclusion | '';
  loadingInteractions: boolean;
  error: string | null;
}

const HISTORY_INTERACTIONS_STORAGE_KEY = 'flavorpal_history_interactions_v1';

const getInteractionsFromStorage = (): ProductInteraction[] | null => {
  const interactionsJson = localStorage.getItem(HISTORY_INTERACTIONS_STORAGE_KEY);
  try {
    return interactionsJson ? JSON.parse(interactionsJson) : null;
  } catch (e) {
    console.error("Error parsing history interactions from localStorage:", e);
    localStorage.removeItem(HISTORY_INTERACTIONS_STORAGE_KEY);
    return null;
  }
};

const saveInteractionsToStorage = (interactions: ProductInteraction[]) => {
  try {
    localStorage.setItem(HISTORY_INTERACTIONS_STORAGE_KEY, JSON.stringify(interactions));
  } catch (e) {
    console.error("Error saving history interactions to localStorage:", e);
  }
};

const generateInteractionId = (prefix: string = 'item_') => `${prefix}${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

export const formatDateForDisplay = (dateInput?: string | Date): string => {
    if (!dateInput) return '';
    try {
        return new Date(dateInput).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
        return dateInput.toString();
    }
};

export const useHistoryStore = defineStore('history', {
  state: (): HistoryStoreState => ({
    allProductInteractions: [],
    discoveredThisMonth: 0,
    totalScanned: 0,
    loadingStats: false,
    filterSearchQuery: '',
    filterDateAfter: '',
    filterReviewedStatus: 'all',
    filterMinRating: 0,
    filterAiConclusion: '',
    loadingInteractions: false,
    error: null,
  }),

  getters: {
    processedHistoryItems: (state): ProductInteraction[] => {
      let items = [...state.allProductInteractions];
      if (state.filterSearchQuery.trim()) {
        const lowerCaseQuery = state.filterSearchQuery.toLowerCase();
        items = items.filter(item =>
          item.name.toLowerCase().includes(lowerCaseQuery) ||
          (item.isReviewed && item.userNotes?.toLowerCase().includes(lowerCaseQuery)) ||
          (!item.isReviewed && item.aiHealthSummary?.toLowerCase().includes(lowerCaseQuery))
        );
      }
      if (state.filterReviewedStatus === 'reviewed_only') {
        items = items.filter(item => item.isReviewed);
        if (state.filterMinRating > 0) {
          items = items.filter(item => item.userRating && item.userRating >= state.filterMinRating);
        }
      } else if (state.filterReviewedStatus === 'scanned_only') {
        items = items.filter(item => !item.isReviewed);
        if (state.filterAiConclusion) {
          items = items.filter(item => item.aiHealthConclusion === state.filterAiConclusion);
        }
      }
      if (state.filterDateAfter) {
        try {
          const filterDate = new Date(state.filterDateAfter);
          filterDate.setHours(0, 0, 0, 0);
          items = items.filter(item => {
            const itemDateString = (item.isReviewed && item.dateReviewed) ? item.dateReviewed : item.dateScanned;
            const itemDate = new Date(itemDateString);
            itemDate.setHours(0, 0, 0, 0);
            return itemDate >= filterDate;
          });
        } catch (e) { console.error("Error parsing date for history filtering:", e); }
      }
      return items.sort((a, b) => {
        const dateA = new Date((a.isReviewed && a.dateReviewed) ? a.dateReviewed : a.dateScanned).getTime();
        const dateB = new Date((b.isReviewed && b.dateReviewed) ? b.dateReviewed : b.dateScanned).getTime();
        return dateB - dateA;
      });
    },
    activeFilterCount: (state): number => {
      let count = 0;
      if (state.filterDateAfter) count++;
      if (state.filterReviewedStatus !== 'all') count++;
      if (state.filterReviewedStatus === 'reviewed_only' && state.filterMinRating > 0) count++;
      if (state.filterReviewedStatus === 'scanned_only' && state.filterAiConclusion) count++;
      return count;
    },

    getRecentlyScannedItems: (state) => (count: number = 3): ProductInteraction[] => {
        return [...state.allProductInteractions]
            .sort((a, b) => new Date(b.dateScanned).getTime() - new Date(a.dateScanned).getTime())
            .slice(0, count);
    }
  },

  actions: {
    async loadInitialData(forceReload: boolean = false) {
        await Promise.all([
            this.loadProductInteractions(forceReload),
            this.loadScanStatistics(forceReload)
        ]);
    },

    async loadProductInteractions(forceReload: boolean = false) {
      if (this.allProductInteractions.length > 0 && !forceReload && !this.error) {
        return;
      }
      this.loadingInteractions = true;
      this.error = null;
    
      try {
        const response = await getAllProductsApi();
        console.log("STORE (loadProductInteractions): API call response:", response);
        if (response.code === 200 && response.data) {
          this.allProductInteractions = response.data;
        } else {
          this.error = (response && response.msg) || 'Failed to load history or data is not in expected format.';
          this.allProductInteractions = [];
        }
        console.log("STORE (loadProductInteractions): API call response:", this.allProductInteractions);
      } catch (err: any) {
        this.error = err.message || 'Failed to load history.';
        this.allProductInteractions = [];
      } finally {
        this.loadingInteractions = false;
      }
    },

    async loadScanStatistics(forceReload: boolean = false) {
      if (this.totalScanned > 0 && this.discoveredThisMonth > 0 && !forceReload && !this.error && !this.loadingStats) {
        return;
      }
      this.loadingStats = true;
      try {
        const stats = await fetchScanStatisticsApi();
        this.discoveredThisMonth = stats.discoveredThisMonth;
        if (this.allProductInteractions.length === 0 || forceReload) {
            this.totalScanned = stats.totalScanned;
        } else if (this.totalScanned < stats.totalScanned) {
            this.totalScanned = stats.totalScanned;
        }
        if (this.allProductInteractions.length > this.totalScanned) {
            this.totalScanned = this.allProductInteractions.length;
        }
      } catch (err: any) {
        const statsError = err.message || 'Failed to load scan statistics.';
        this.error = this.error ? `${this.error}; ${statsError}` : statsError;
      } finally {
        this.loadingStats = false;
      }
    },

    async getProductHealthInsight(productId: number, capturedPhoto: CapturedPhoto): Promise<boolean> {
      const response = await getProductHealthInsightApi({ productId, base64Image: capturedPhoto.data });
      return response.code == 200;
    },

    async getProductInteractionById(id: number): Promise<ProductInteraction | undefined> {
      const product = await getProductByIdApi(id);
      console.log("STORE (getProductInteractionById): API call response:", product);
      return product;
    },

    async deleteProductInteraction(id: number): Promise<boolean> {
      const response = await deleteProductByIdApi(id);
      console.log("STORE (deleteProductInteraction): API call response:", response);
      return response.code == 200;
    },

    setFilters(filters: Partial<HistoryFilters>) { 
      this.filterDateAfter = filters.dateAfter || '';
      this.filterReviewedStatus = filters.reviewedStatus || 'all';
      this.filterMinRating = filters.minRating || 0;
      this.filterAiConclusion = filters.aiConclusion || '';
    },
    setInitialHistoryFilters(status: ReviewedFilterStatus) { 
      this.filterReviewedStatus = status;
    },
    clearAllFilters() { 
      this.filterDateAfter = '';
      this.filterReviewedStatus = 'all';
      this.filterMinRating = 0;
      this.filterAiConclusion = '';
    },

    clearHistoryData() {
      this.allProductInteractions = [];
      this.clearAllFilters();
      this.discoveredThisMonth = 0;
      this.totalScanned = 0;
      this.loadingStats = false;
      this.loadingInteractions = false;
      this.error = null;
      localStorage.removeItem(HISTORY_INTERACTIONS_STORAGE_KEY);
    },

    addOrUpdateInteraction(interaction: ProductInteraction) {
        const index = this.allProductInteractions.findIndex(item => item.id === interaction.id);
        let isNewToList = false;
        if (index !== -1) {
            this.allProductInteractions[index] = { ...this.allProductInteractions[index], ...interaction };
        } else {
            this.allProductInteractions.unshift(interaction);
            isNewToList = true;
        }
        if (isNewToList) {
            this.totalScanned++;
        }
        this.allProductInteractions.sort((a, b) => {
          const dateA = new Date((a.isReviewed && a.dateReviewed) ? a.dateReviewed : a.dateScanned).getTime();
          const dateB = new Date((b.isReviewed && b.dateReviewed) ? b.dateReviewed : b.dateScanned).getTime();
          return dateB - dateA;
        });
        saveInteractionsToStorage(this.allProductInteractions);
    },
    async saveOrUpdateUserReview(productId: number, reviewData: ReViewDataPayload): Promise<Boolean> {

      const product = this.allProductInteractions.find(item => item.id === productId);
      if (product?.isReviewed) {
        const response = await updateReviewForProductApi(productId, reviewData);
        return response.code == 201;
      } else {
        const response = await addReviewForProductApi(productId, reviewData);
        return response.code == 200;
      }
    },
  },
});
