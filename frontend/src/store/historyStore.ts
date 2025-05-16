// src/store/historyStore.ts
import { defineStore } from 'pinia';
import type { ProductInteraction, AiHealthConclusion } from '../types';
import { fetchProductInteractionsApi, fetchScanStatisticsApi } from '../services/historyService'; 

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

const formatDateForDisplay = (dateInput?: string | Date): string => {
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
    // ... (processedHistoryItems, activeFilterCount, getProductInteractionById, getRecentlyScannedItems remain the same) ...
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
      // ... (logic remains the same) ...
      if (this.allProductInteractions.length > 0 && !forceReload && !this.error) {
        // return; 
      }
      this.loadingInteractions = true;
      this.error = null;
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
      // ... (logic remains the same) ...
       if (this.totalScanned > 0 && this.discoveredThisMonth > 0 && !forceReload && !this.error && !this.loadingStats) {
        // return;
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

    setFilters(filters: Partial<HistoryFilters>) { /* ... */ },
    setInitialHistoryFilters(status: ReviewedFilterStatus) { /* ... */ },
    clearAllFilters() { /* ... */ },
    
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
        this.allProductInteractions.sort((a, b) => { /* ... */ });
        saveInteractionsToStorage(this.allProductInteractions); 
    },
        
    async saveOrUpdateUserReview(reviewData: ReviewDataPayload): Promise<ProductInteraction | null> {
        // ... (logic remains the same, ensure it calls saveInteractionsToStorage) ...
        this.loadingInteractions = true; 
        this.error = null;
        await new Promise(resolve => setTimeout(resolve, 400)); 

        try {
            const todayISO = new Date().toISOString(); 
            const displayDate = formatDateForDisplay(todayISO);

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
                    dateReviewed: displayDate, 
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
                    dateScanned: displayDate, 
                    aiHealthSummary: reviewData.aiHealthSummary, 
                    aiHealthConclusion: reviewData.aiHealthConclusion,
                    isReviewed: true,
                    userRating: reviewData.userRating,
                    userNotes: reviewData.userNotes,
                    dateReviewed: displayDate,
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
    },

    /**
     * NEW ACTION: Deletes a product interaction from history.
     * @param itemId - The ID of the ProductInteraction to delete.
     * @returns True if deletion was successful, false otherwise.
     */
    async deleteProductInteraction(itemId: string): Promise<boolean> {
        this.loadingInteractions = true; // Indicate an operation is in progress
        this.error = null;
        await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay

        try {
            const itemIndex = this.allProductInteractions.findIndex(item => item.id === itemId);
            if (itemIndex !== -1) {
                this.allProductInteractions.splice(itemIndex, 1); // Remove from array
                
                // Decrement totalScanned.
                // This is a simple decrement; more complex logic might be needed if an item
                // could be "scanned" multiple times under the same ID before being deleted.
                // For MVP, if it's removed from the list, we reduce the count.
                if (this.totalScanned > 0) {
                    this.totalScanned--;
                }
                // Note: Accurately adjusting discoveredThisMonth on client-side delete is complex.
                // For MVP, we might accept this stat becomes slightly off or trigger a full stat reload (heavier).
                // Let's keep it simple and just adjust totalScanned.

                saveInteractionsToStorage(this.allProductInteractions); // Persist changes
                console.log('HistoryStore: Deleted interaction -', itemId);
                this.loadingInteractions = false;
                return true;
            } else {
                console.warn('HistoryStore: Item to delete not found -', itemId);
                this.error = "Item not found for deletion.";
                this.loadingInteractions = false;
                return false;
            }
        } catch (err: any) {
            console.error('HistoryStore: Error deleting interaction -', err);
            this.error = err.message || "Failed to delete item.";
            this.loadingInteractions = false;
            return false;
        }
    }
  },
});
