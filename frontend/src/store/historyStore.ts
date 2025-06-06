// src/store/historyStore.ts
import { defineStore } from 'pinia';
import type { ProductInteraction, AiHealthConclusion, ReViewDataPayload } from '../types';
import { getAllProductsOfCurrentUserApi, getProductByIdApi, addReviewForProductApi, updateReviewForProductApi, deleteProductByIdApi, getProductHealthInsightApi, getAllProductReviewsApi } from '../services/productService';
import { getScanStatisticsApi } from '@/services/authService';
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
  totalReviewed: number;
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

export const useHistoryStore = defineStore('history', {
  state: (): HistoryStoreState => ({
    allProductInteractions: [],
    discoveredThisMonth: 0,
    totalReviewed: -1,
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
            const itemDate = new Date(itemDateString || '');
            return itemDate >= filterDate;
          });
        } catch (e) { console.error("Error parsing date for history filtering:", e); }
      }
      return items.sort((a, b) => {
        const dateA = new Date(a.dateScanned?.replace(", ", " ") || '').getTime();
        const dateB = new Date(b.dateScanned?.replace(", ", " ") || '').getTime();
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
    // get recently scanned items from allProductInteractions sort in order newest to oldest
    // dateScanned return as string e.g: "2025-05-30, 06:29:31"
    getRecentlyScannedItems: (state) => (count: number = 3): ProductInteraction[] => {
      return [...state.allProductInteractions]
          .sort((a, b) => {
            const dateA = new Date(a.dateScanned?.replace(", ", " ") || '').getTime();
            const dateB = new Date(b.dateScanned?.replace(", ", " ") || '').getTime();

            return dateB - dateA;
          })
          .slice(0, count);
    },
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
        const response = await getAllProductsOfCurrentUserApi();
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
        const stats = await getScanStatisticsApi();
        this.discoveredThisMonth = stats.data.discoveredThisMonth;
        if (this.allProductInteractions.length === 0 || forceReload) {
            this.totalScanned = stats.data.totalScanned;
        } else if (this.totalScanned < stats.data.totalScanned) {
            this.totalScanned = stats.data.totalScanned;
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

    async loadProductReviewStatistics() {
      try {
        const allProductReviews = await getAllProductReviewsApi()
        this.totalReviewed = allProductReviews.data.length
      } catch (err: any) {
        const error = err.message || 'Failed to fetch product review statistics';
        this.error = this.error ? `${this.error}; ${error}` : error;
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
      this.totalReviewed = 0;
      this.loadingStats = false;
      this.loadingInteractions = false;
      this.error = null;
    },

    async saveOrUpdateUserReview(productId: number, reviewData: ReViewDataPayload): Promise<Boolean> {
      this.totalReviewed++; // Manually increment to avoid fetching it again
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
