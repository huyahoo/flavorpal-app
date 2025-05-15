// src/store/historyStore.ts
import { defineStore } from 'pinia';
import type { ProductInteraction, AiHealthConclusion } from '../types';
import { fetchProductInteractionsApi } from '../services/historyService'; // Ensure path is correct

export type ReviewedFilterStatus = 'all' | 'reviewed_only' | 'scanned_only';

export interface HistoryStoreState {
  allProductInteractions: ProductInteraction[]; // Master list of all interactions
  
  // Filter states
  filterSearchQuery: string;
  filterDateAfter: string;           // YYYY-MM-DD format, or empty
  filterReviewedStatus: ReviewedFilterStatus; // 'all', 'reviewed_only', 'scanned_only'
  filterMinRating: number;           // 0-5, 0 means no rating filter (only applies if filterReviewedStatus is 'reviewed_only')
  filterAiConclusion?: AiHealthConclusion | ''; // Specific AI conclusion, or empty for all (only if filterReviewedStatus is 'scanned_only')

  loading: boolean;
  error: string | null;
}

export const useHistoryStore = defineStore('history', {
  state: (): HistoryStoreState => ({
    allProductInteractions: [],
    
    filterSearchQuery: '',
    filterDateAfter: '',
    filterReviewedStatus: 'all', // Default to show all items
    filterMinRating: 0,
    filterAiConclusion: '',

    loading: false,
    error: null,
  }),

  getters: {
    /**
     * Processes and returns the filtered list of product interactions
     * based on the current filter states.
     */
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
        } catch (e) {
          console.error("Error parsing date for history filtering:", e);
        }
      }
      
      return items.sort((a, b) => new Date(b.dateScanned).getTime() - new Date(a.dateScanned).getTime());
    },

    /**
     * Counts the number of active filters.
     */
    activeFilterCount: (state): number => {
      let count = 0;
      if (state.filterDateAfter) count++;
      if (state.filterReviewedStatus !== 'all') count++;
      if (state.filterReviewedStatus === 'reviewed_only' && state.filterMinRating > 0) count++;
      if (state.filterReviewedStatus === 'scanned_only' && state.filterAiConclusion) count++;
      return count;
    },

    /**
     * Gets a single product interaction by its ID.
     * @param state - The current store state.
     * @returns A function that takes an ID and returns the ProductInteraction or undefined.
     */
    getProductInteractionById: (state) => {
      return (id: string): ProductInteraction | undefined => {
        return state.allProductInteractions.find(item => item.id === id);
      };
    }
  },

  actions: {
    /**
     * Fetches all product interactions from the service.
     */
    async loadProductInteractions(forceReload: boolean = false) {
      if (this.allProductInteractions.length > 0 && !forceReload && !this.error) {
        // return; 
      }
      this.loading = true;
      this.error = null;
      try {
        const interactions = await fetchProductInteractionsApi();
        this.allProductInteractions = interactions;
        console.log('Product interactions loaded into history store:', interactions.length);
      } catch (err: any) {
        console.error('Error loading product interactions:', err);
        this.error = err.message || 'Failed to load history.';
        this.allProductInteractions = [];
      } finally {
        this.loading = false;
      }
    },

    setFilters(filters: {
      dateAfter?: string;
      reviewedStatus?: ReviewedFilterStatus;
      minRating?: number;
      aiConclusion?: AiHealthConclusion | '';
    }) {
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
      console.log('History filters set:', this.$state);
    },

    setInitialHistoryFilters(status: ReviewedFilterStatus) {
        this.filterSearchQuery = ''; 
        this.filterDateAfter = '';   
        this.filterReviewedStatus = status;
        this.filterMinRating = 0;    
        this.filterAiConclusion = '';
        console.log('Initial history filters set to show:', status);
    },

    clearAllFilters() {
      this.filterSearchQuery = '';
      this.filterDateAfter = '';
      this.filterReviewedStatus = 'all';
      this.filterMinRating = 0;
      this.filterAiConclusion = '';
      console.log('All history filters cleared.');
    },
    
    clearHistoryData() {
      this.allProductInteractions = [];
      this.clearAllFilters(); 
      this.error = null;
      console.log('History data cleared from store.');
    },

    // Action to update a product interaction (e.g., after editing notes or marking as new)
    // This is a mock update; in a real app, it would call a service.
    updateProductInteraction(updatedItem: ProductInteraction) {
        const index = this.allProductInteractions.findIndex(item => item.id === updatedItem.id);
        if (index !== -1) {
            this.allProductInteractions[index] = { ...this.allProductInteractions[index], ...updatedItem };
            console.log('Product interaction updated in store:', updatedItem.id);
            // If this item was also in ScannedProductsStore, it might need updating there too,
            // or ScannedProductsStore could listen for changes if needed.
        } else {
            console.warn('Could not find product interaction to update in store:', updatedItem.id);
        }
    }
  },
});
