// src/store/historyStore.ts
import { defineStore } from 'pinia';
import type { ProductInteraction, AiHealthConclusion } from '../types';
// Import both service functions from historyService
import { fetchProductInteractionsApi, fetchScanStatisticsApi } from '../services/historyService'; 

export type ReviewedFilterStatus = 'all' | 'reviewed_only' | 'scanned_only';

export interface HistoryStoreState {
  allProductInteractions: ProductInteraction[]; 
  
  // Scan Statistics - MOVED HERE
  discoveredThisMonth: number;
  totalScanned: number;
  loadingStats: boolean; // Loading indicator for stats

  // Filter states
  filterSearchQuery: string;
  filterDateAfter: string;           
  filterReviewedStatus: ReviewedFilterStatus; 
  filterMinRating: number;           
  filterAiConclusion?: AiHealthConclusion | ''; 

  loadingInteractions: boolean; // Loading indicator for interactions list
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
    
    discoveredThisMonth: 0, // Initialize stats
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
      // ... (filter logic remains the same) ...
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
      // ... (filter count logic remains the same) ...
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

    /**
     * NEW ACTION: Fetches the user's scanning statistics.
     */
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
        // Append to existing error or set new one specifically for stats
        const statsError = err.message || 'Failed to load scan statistics.';
        this.error = this.error ? `${this.error}; ${statsError}` : statsError;
        console.error('Error loading scan statistics:', err);
      } finally {
        this.loadingStats = false;
      }
    },

    setFilters(filters: { /* ... */ }) { /* ... remains the same ... */ 
        this.filterDateAfter = filters.dateAfter ?? this.filterDateAfter;
        this.filterReviewedStatus = filters.reviewedStatus ?? this.filterReviewedStatus;
        if (this.filterReviewedStatus === 'reviewed_only') {
            this.filterMinRating = filters.minRating ?? 0;
        } else { this.filterMinRating = 0; }
        if (this.filterReviewedStatus === 'scanned_only') {
            this.filterAiConclusion = filters.aiConclusion ?? '';
        } else { this.filterAiConclusion = ''; }
    },
    setInitialHistoryFilters(status: ReviewedFilterStatus) { /* ... remains the same ... */ 
        this.filterSearchQuery = ''; 
        this.filterDateAfter = '';   
        this.filterReviewedStatus = status;
        this.filterMinRating = 0;    
        this.filterAiConclusion = '';
    },
    clearAllFilters() { /* ... remains the same ... */ 
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
        let isNewToList = false;
        if (index !== -1) {
            // Item exists, update it
            this.allProductInteractions[index] = { ...this.allProductInteractions[index], ...interaction };
            console.log('HistoryStore: Updated interaction -', interaction.name);
        } else {
            // Item is new, add it (typically to the beginning for recency before sort)
            this.allProductInteractions.unshift(interaction);
            isNewToList = true; // Flag that this was a new addition by ID
            console.log('HistoryStore: Added new interaction -', interaction.name);
        }
        
        // Update totalScanned if it's a new item by ID.
        // The discoveredThisMonth is harder to track client-side accurately without more date logic,
        // so we'll rely on loadScanStatistics for that.
        if (isNewToList) {
            this.totalScanned++; 
            // For a more reactive discoveredThisMonth, you could check if interaction.dateScanned is in current month
        }

        // Re-sort after add/update to maintain desired order (e.g., by most recent scan/review date)
        this.allProductInteractions.sort((a, b) => {
            const dateA = new Date((a.isReviewed && a.dateReviewed) ? a.dateReviewed : a.dateScanned).getTime();
            const dateB = new Date((b.isReviewed && b.dateReviewed) ? b.dateReviewed : b.dateScanned).getTime();
            return dateB - dateA;
        });
        saveInteractionsToStorage(this.allProductInteractions); 
    },
        
    async saveOrUpdateUserReview(reviewData: { /* ... as before ... */ }): Promise<ProductInteraction | null> {
        // ... (saveOrUpdateUserReview logic as before) ...
        // Ensure it calls saveInteractionsToStorage(this.allProductInteractions) at the end.
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
                    dateReviewed: today, // Set/update review date
                    imageUrl: reviewData.imageUrl || existingItem.imageUrl, 
                    barcode: reviewData.barcode || existingItem.barcode,
                    // Preserve AI insights if they existed
                    aiHealthSummary: existingItem.aiHealthSummary || reviewData.aiHealthSummary,
                    aiHealthConclusion: existingItem.aiHealthConclusion || reviewData.aiHealthConclusion,
                };
                this.allProductInteractions[existingItemIndex] = interactionToSave;
            } else {
                // This case is for a review being added to an item not previously in history,
                // or a completely new manual review entry.
                interactionToSave = {
                    id: reviewData.productIdToUpdate || generateInteractionId('review_'), 
                    name: reviewData.productName,
                    imageUrl: reviewData.imageUrl,
                    dateScanned: today, // If new, scan date is today
                    aiHealthSummary: reviewData.aiHealthSummary, 
                    aiHealthConclusion: reviewData.aiHealthConclusion,
                    isReviewed: true,
                    userRating: reviewData.userRating,
                    userNotes: reviewData.userNotes,
                    dateReviewed: today,
                    barcode: reviewData.barcode,
                };
                this.allProductInteractions.unshift(interactionToSave); 
                this.totalScanned++; // A new review for a new item is also a new "scanned" interaction
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
