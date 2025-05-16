// src/store/historyStore.ts
import { defineStore } from 'pinia';
import type { ProductInteraction, AiHealthConclusion } from '../types';
import { fetchProductInteractionsApi, fetchScanStatisticsApi } from '../services/historyService'; 

export type ReviewedFilterStatus = 'all' | 'reviewed_only' | 'scanned_only';

// Define a type for the filters object
export interface HistoryFilters {
  dateAfter?: string;
  reviewedStatus?: ReviewedFilterStatus;
  minRating?: number;
  aiConclusion?: AiHealthConclusion | '';
}

// Define a type for the review data object
export interface ReviewDataPayload {
  productIdToUpdate?: string; 
  productName: string;
  userRating: number;
  userNotes: string;
  imageUrl?: string; 
  barcode?: string; 
  aiHealthSummary?: string;
  aiHealthConclusion?: AiHealthConclusion;
  // dateScanned is usually part of existing item or set when new
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
  loadingInteractions: boolean; // Specific loading for interactions list
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
    loadingInteractions: false, // Use this for loading the list
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
    getProductInteractionById: (state) => {
      return (id: string): ProductInteraction | undefined => {
        return state.allProductInteractions.find(item => item.id === id);
      };
    },
    /**
     * NEW GETTER: Gets the most recently scanned items.
     * Sorts all interactions by dateScanned and takes the top 'count'.
     * This ensures items just scanned (even if reviewed later) appear if their scan date is recent.
     */
    getRecentlyScannedItems: (state) => (count: number = 3): ProductInteraction[] => {
        return [...state.allProductInteractions]
            .sort((a, b) => new Date(b.dateScanned).getTime() - new Date(a.dateScanned).getTime())
            .slice(0, count);
    }
  },

  actions: {
    async loadProductInteractions(forceReload: boolean = false) {
      if (this.allProductInteractions.length > 0 && !forceReload && !this.error) {
        // return; 
      }
      this.loadingInteractions = true;
      this.error = null; // Clear previous general errors before new fetch attempt
      try {
        let interactions = null;
        if (!forceReload) {
          interactions = getInteractionsFromStorage(); 
        }
        if (interactions) {
          this.allProductInteractions = interactions;
        } else {
          interactions = await fetchProductInteractionsApi(); 
          this.allProductInteractions = interactions;
          saveInteractionsToStorage(this.allProductInteractions); 
        }
      } catch (err: any) {
        this.error = err.message || 'Failed to load history.';
        this.allProductInteractions = []; 
      } finally {
        this.loadingInteractions = false;
      }
    },

    async loadScanStatistics(forceReload: boolean = false) {
       if (this.totalScanned > 0 && !forceReload && !this.error && !this.loadingStats) {
        // return;
      }
      this.loadingStats = true;
      // Don't clear general error if interaction loading might be fine
      try {
        const stats = await fetchScanStatisticsApi();
        this.discoveredThisMonth = stats.discoveredThisMonth;
        this.totalScanned = stats.totalScanned;
      } catch (err: any) {
        const statsError = err.message || 'Failed to load scan statistics.';
        this.error = this.error ? `${this.error}; ${statsError}` : statsError;
      } finally {
        this.loadingStats = false;
      }
    },

    setFilters(filters: Partial<HistoryFilters>) { 
        this.filterDateAfter = filters.dateAfter ?? this.filterDateAfter;
        this.filterReviewedStatus = filters.reviewedStatus ?? this.filterReviewedStatus;
        
        if (this.filterReviewedStatus === 'reviewed_only') {
            this.filterMinRating = filters.minRating ?? 0;
        } else {
            this.filterMinRating = 0; 
        }

        if (this.filterReviewedStatus === 'scanned_only') {
            this.filterAiConclusion = filters.aiConclusion ?? '';
        } else {
            this.filterAiConclusion = ''; 
        }
    },
    setInitialHistoryFilters(status: ReviewedFilterStatus) {
        this.filterSearchQuery = ''; 
        this.filterDateAfter = '';   
        this.filterReviewedStatus = status;
        this.filterMinRating = 0;    
        this.filterAiConclusion = '';
    },
    clearAllFilters() { /* ... */ 
      this.filterSearchQuery = '';
      this.filterDateAfter = '';
      this.filterReviewedStatus = 'all';
      this.filterMinRating = 0;
      this.filterAiConclusion = '';
    },
    
    clearHistoryData() {
      this.allProductInteractions = [];
      this.clearAllFilters(); 
      this.discoveredThisMonth = 0; // Clear stats
      this.totalScanned = 0;        // Clear stats
      this.loadingStats = false;    // Reset loading state for stats
      this.loadingInteractions = false;
      this.error = null;
      localStorage.removeItem(HISTORY_INTERACTIONS_STORAGE_KEY); 
    },

    /**
     * Adds a new product interaction or updates an existing one.
     * Also updates totalScanned count if it's a truly new item by ID.
     * @param interaction - The ProductInteraction object to add or update.
     */
    addOrUpdateInteraction(interaction: ProductInteraction) {
        const index = this.allProductInteractions.findIndex(item => item.id === interaction.id);
        let isNewItemToList = false;
        if (index !== -1) {
            this.allProductInteractions[index] = { ...this.allProductInteractions[index], ...interaction };
        } else {
            this.allProductInteractions.unshift(interaction);
            isNewItemToList = true;
        }
        if (isNewItemToList) {
            this.totalScanned++; 
        }
        this.allProductInteractions.sort((a, b) => {
          const dateA = new Date((a.isReviewed && a.dateReviewed) ? a.dateReviewed : a.dateScanned).getTime();
          const dateB = new Date((b.isReviewed && b.dateReviewed) ? b.dateReviewed : b.dateScanned).getTime();
          return dateB - dateA;
      });
        saveInteractionsToStorage(this.allProductInteractions); 
    },
        
    async saveOrUpdateUserReview(reviewData: ReviewDataPayload): Promise<ProductInteraction | null> {
        this.loadingInteractions = true; 
        this.error = null;
        await new Promise(resolve => setTimeout(resolve, 400)); 

        try {
            const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            let interactionToSave: ProductInteraction;
            let existingItemIndex = -1;

            if (this.allProductInteractions.length === 0 && !this.loadingInteractions) {
                await this.loadProductInteractions(); 
            }

            if (reviewData.productIdToUpdate) {
                existingItemIndex = this.allProductInteractions.findIndex(item => item.id === reviewData.productIdToUpdate);
            }

            if (existingItemIndex !== -1) {
                const existingItem = this.allProductInteractions[existingItemIndex];
                interactionToSave = {
                    ...existingItem, 
                    name: reviewData.productName, 
                    isReviewed: true,
                    userRating: reviewData.userRating,
                    userNotes: reviewData.userNotes,
                    dateReviewed: today,
                    imageUrl: reviewData.imageUrl || existingItem.imageUrl, 
                    barcode: reviewData.barcode || existingItem.barcode,
                    aiHealthSummary: existingItem.aiHealthSummary || reviewData.aiHealthSummary,
                    aiHealthConclusion: existingItem.aiHealthConclusion || reviewData.aiHealthConclusion,
                };
                this.allProductInteractions[existingItemIndex] = interactionToSave;
            } else {
                interactionToSave = {
                    id: reviewData.productIdToUpdate || generateInteractionId('review_'), 
                    name: reviewData.productName,
                    imageUrl: reviewData.imageUrl,
                    dateScanned: today, 
                    aiHealthSummary: reviewData.aiHealthSummary, 
                    aiHealthConclusion: reviewData.aiHealthConclusion,
                    isReviewed: true,
                    userRating: reviewData.userRating,
                    userNotes: reviewData.userNotes,
                    dateReviewed: today,
                    barcode: reviewData.barcode,
                };
                this.allProductInteractions.unshift(interactionToSave); 
                this.totalScanned++; 
            }
            
            this.allProductInteractions.sort((a, b) => {
              const dateA = new Date((a.isReviewed && a.dateReviewed) ? a.dateReviewed : a.dateScanned).getTime();
              const dateB = new Date((b.isReviewed && b.dateReviewed) ? b.dateReviewed : b.dateScanned).getTime();
              return dateB - dateA;
          });
            saveInteractionsToStorage(this.allProductInteractions);
            this.loadingInteractions = false;
            return interactionToSave; 

        } catch (err: any) {
            this.error = err.message || "Failed to save review.";
            this.loadingInteractions = false;
            return null;
        }
    }
  },
});
