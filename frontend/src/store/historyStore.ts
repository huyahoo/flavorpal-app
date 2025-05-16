// src/store/historyStore.ts
import { defineStore } from 'pinia';
import type { ProductInteraction, AiHealthConclusion } from '../types';
import { fetchProductInteractionsApi } from '../services/historyService'; 

export type ReviewedFilterStatus = 'all' | 'reviewed_only' | 'scanned_only';

export interface HistoryStoreState {
  allProductInteractions: ProductInteraction[]; 
  filterSearchQuery: string;
  filterDateAfter: string;           
  filterReviewedStatus: ReviewedFilterStatus; 
  filterMinRating: number;           
  filterAiConclusion?: AiHealthConclusion | ''; 
  loading: boolean;
  error: string | null;
}

const HISTORY_INTERACTIONS_STORAGE_KEY = 'flavorpal_history_interactions_v1';

// --- localStorage Helper Functions for History ---
/**
 * Retrieves all product interactions from localStorage.
 * @returns An array of ProductInteraction objects or null if not found/error.
 */
const getInteractionsFromStorage = (): ProductInteraction[] | null => {
  const interactionsJson = localStorage.getItem(HISTORY_INTERACTIONS_STORAGE_KEY);
  try {
    return interactionsJson ? JSON.parse(interactionsJson) : null;
  } catch (e) {
    console.error("Error parsing history interactions from localStorage:", e);
    localStorage.removeItem(HISTORY_INTERACTIONS_STORAGE_KEY); // Clear corrupted data
    return null;
  }
};

/**
 * Saves the array of product interactions to localStorage.
 * @param interactions - The array of ProductInteraction objects to save.
 */
const saveInteractionsToStorage = (interactions: ProductInteraction[]) => {
  try {
    localStorage.setItem(HISTORY_INTERACTIONS_STORAGE_KEY, JSON.stringify(interactions));
  } catch (e) {
    console.error("Error saving history interactions to localStorage:", e);
  }
};
// --- End localStorage Helper Functions ---


// Helper to generate a new mock ID if one isn't found from scanService
const generateInteractionId = (prefix: string = 'item_') => `${prefix}${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

export const useHistoryStore = defineStore('history', {
  state: (): HistoryStoreState => ({
    allProductInteractions: [],
    filterSearchQuery: '',
    filterDateAfter: '',
    filterReviewedStatus: 'all', 
    filterMinRating: 0,
    filterAiConclusion: '',
    loading: false,
    error: null,
  }),

  getters: {
    processedHistoryItems: (state): ProductInteraction[] => {
      let items = [...state.allProductInteractions]; 
      // ... (rest of the filter logic remains the same) ...
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
    }
  },

  actions: {
    /**
     * Fetches all product interactions.
     * Tries to load from localStorage first, then falls back to API (mock).
     */
    async loadProductInteractions(forceReload: boolean = false) {
      if (this.allProductInteractions.length > 0 && !forceReload && !this.error) {
        // console.log('HistoryStore: Interactions already loaded.');
        // return; 
      }
      this.loading = true;
      this.error = null;
      try {
        let interactions = null;
        if (!forceReload) {
          interactions = getInteractionsFromStorage(); // Try loading from localStorage
        }

        if (interactions) {
          this.allProductInteractions = interactions;
          console.log('HistoryStore: Interactions loaded from localStorage.', interactions.length);
        } else {
          interactions = await fetchProductInteractionsApi(); // Fetch from mock API
          this.allProductInteractions = interactions;
          saveInteractionsToStorage(this.allProductInteractions); // Save initial set to localStorage
          console.log('HistoryStore: Interactions fetched from API and saved to localStorage.', interactions.length);
        }
      } catch (err: any) {
        this.error = err.message || 'Failed to load history.';
        this.allProductInteractions = []; // Clear on error
        console.error('HistoryStore: Error loading product interactions:', err);
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
      // ... (filter setting logic remains the same) ...
      this.filterDateAfter = filters.dateAfter ?? this.filterDateAfter;
      this.filterReviewedStatus = filters.reviewedStatus ?? this.filterReviewedStatus;
      if (this.filterReviewedStatus === 'reviewed_only') {
        this.filterMinRating = filters.minRating ?? 0;
      } else { this.filterMinRating = 0; }
      if (this.filterReviewedStatus === 'scanned_only') {
        this.filterAiConclusion = filters.aiConclusion ?? '';
      } else { this.filterAiConclusion = ''; }
    },

    setInitialHistoryFilters(status: ReviewedFilterStatus) {
      // ... (logic remains the same) ...
        this.filterSearchQuery = ''; 
        this.filterDateAfter = '';   
        this.filterReviewedStatus = status;
        this.filterMinRating = 0;    
        this.filterAiConclusion = '';
    },

    clearAllFilters() {
      // ... (logic remains the same) ...
      this.filterSearchQuery = '';
      this.filterDateAfter = '';
      this.filterReviewedStatus = 'all';
      this.filterMinRating = 0;
      this.filterAiConclusion = '';
    },
    
    clearHistoryData() {
      this.allProductInteractions = [];
      this.clearAllFilters(); 
      this.error = null;
      localStorage.removeItem(HISTORY_INTERACTIONS_STORAGE_KEY); // Clear from localStorage
      console.log('HistoryStore: History data cleared from store and localStorage.');
    },

    addOrUpdateInteraction(interaction: ProductInteraction) {
        const index = this.allProductInteractions.findIndex(item => item.id === interaction.id);
        if (index !== -1) {
            this.allProductInteractions[index] = { ...this.allProductInteractions[index], ...interaction };
        } else {
            this.allProductInteractions.unshift(interaction);
        }
        this.allProductInteractions.sort((a, b) => new Date(b.dateScanned).getTime() - new Date(a.dateScanned).getTime());
        saveInteractionsToStorage(this.allProductInteractions); // Save changes to localStorage
    },
    
    updateProductInteraction(updatedItem: ProductInteraction) {
        const index = this.allProductInteractions.findIndex(item => item.id === updatedItem.id);
        if (index !== -1) {
            this.allProductInteractions[index] = { ...this.allProductInteractions[index], ...updatedItem };
        } else {
            console.warn('Product interaction to update not found, adding as new:', updatedItem.id);
            this.allProductInteractions.unshift(updatedItem); 
        }
        this.allProductInteractions.sort((a, b) => new Date(b.dateScanned).getTime() - new Date(a.dateScanned).getTime());
        saveInteractionsToStorage(this.allProductInteractions); // Save changes to localStorage
    },

    async saveOrUpdateUserReview(reviewData: {
        productIdToUpdate?: string; 
        productName: string;
        userRating: number;
        userNotes: string;
        imageUrl?: string; 
        barcode?: string; 
        aiHealthSummary?: string;
        aiHealthConclusion?: AiHealthConclusion;
    }): Promise<ProductInteraction | null> {
        this.loading = true;
        this.error = null;
        await new Promise(resolve => setTimeout(resolve, 400)); 

        try {
            const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            let interactionToSave: ProductInteraction;
            let existingItemIndex = -1;

            // Ensure interactions are loaded before trying to find/update
            if (this.allProductInteractions.length === 0) {
                await this.loadProductInteractions(); // Load if empty
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
            }
            
            this.allProductInteractions.sort((a, b) => {
                const dateA = new Date((a.isReviewed && a.dateReviewed) ? a.dateReviewed : a.dateScanned).getTime();
                const dateB = new Date((b.isReviewed && b.dateReviewed) ? b.dateReviewed : b.dateScanned).getTime();
                return dateB - dateA;
            });

            saveInteractionsToStorage(this.allProductInteractions); // MODIFIED: Save to localStorage
            console.log('HistoryStore: Review saved/updated and persisted -', interactionToSave.name);
            this.loading = false;
            return interactionToSave; 

        } catch (err: any) {
            console.error('HistoryStore: Error saving review:', err);
            this.error = err.message || "Failed to save review.";
            this.loading = false;
            return null;
        }
    }
  },
});
