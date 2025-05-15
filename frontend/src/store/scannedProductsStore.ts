// src/store/scannedProductsStore.ts
import { defineStore } from 'pinia';
import type { ScannedItem } from '../types';
import { fetchRecentScansApi, fetchScanStatisticsApi } from '../services/scannedProductsService';

export interface ScannedProductsStoreState {
  recentScans: ScannedItem[];
  discoveredThisMonth: number;
  totalScanned: number;
  loadingScans: boolean;
  loadingStats: boolean;
  error: string | null;
}

export const useScannedProductsStore = defineStore('scannedProducts', {
  state: (): ScannedProductsStoreState => ({
    recentScans: [],
    discoveredThisMonth: 0,
    totalScanned: 0,
    loadingScans: false,
    loadingStats: false,
    error: null,
  }),

  getters: {
    // Get the first few recent scans for a summary display
    getSummaryRecentScans: (state) => (count: number = 3): ScannedItem[] => {
      return state.recentScans.slice(0, count);
    },
  },

  actions: {
    /**
     * Fetches the list of recently scanned items.
     */
    async loadRecentScans(forceReload: boolean = false) {
      if (this.recentScans.length > 0 && !forceReload && !this.error) {
        // console.log('Recent scans already available in store.');
        // return; // Uncomment to prevent re-fetching if data exists
      }
      this.loadingScans = true;
      this.error = null;
      try {
        const scans = await fetchRecentScansApi();
        this.recentScans = scans;
        console.log('Recent scans loaded into store:', this.recentScans.length);
      } catch (err: any) {
        console.error('Error loading recent scans:', err);
        this.error = err.message || 'Failed to load recent scans.';
        this.recentScans = []; // Clear on error
      } finally {
        this.loadingScans = false;
      }
    },

    /**
     * Fetches the user's scanning statistics.
     */
    async loadScanStatistics(forceReload: boolean = false) {
       if (this.totalScanned > 0 && !forceReload && !this.error) {
        // console.log('Scan stats already available in store.');
        // return;
      }
      this.loadingStats = true;
      // this.error = null; // Don't clear general error if scans are fine
      try {
        const stats = await fetchScanStatisticsApi();
        this.discoveredThisMonth = stats.discoveredThisMonth;
        this.totalScanned = stats.totalScanned;
        console.log('Scan statistics loaded into store:', stats);
      } catch (err: any) {
        console.error('Error loading scan statistics:', err);
        // Set a specific error for stats or append to general error
        this.error = (this.error ? this.error + '; ' : '') + (err.message || 'Failed to load scan statistics.');
      } finally {
        this.loadingStats = false;
      }
    },

    /**
     * Action to add a newly scanned item to the list (client-side for mock).
     * In a real app, this would likely involve an API call to save the scan.
     * @param newItem - The ScannedItem object to add.
     */
    addScannedItem(newItem: ScannedItem) {
        // Add to the beginning of the list for "recent" feel
        this.recentScans.unshift(newItem);
        // Update stats (simplified for mock)
        this.totalScanned++;
        // Logic for 'discoveredThisMonth' would be more complex (check if truly new this month)
        // For now, let's just increment if it's a new day or something simple
        const today = new Date().toLocaleDateString();
        if (newItem.dateScanned.includes(today.split('/')[1])) { // Very basic check if month matches
             // This logic is too simple for real "discovered this month"
        }
        console.log('New item added to recent scans (mock):', newItem.name);
    },

    /**
     * Clears all scanned product data (e.g., on logout).
     */
    clearScannedProductsData() {
      this.recentScans = [];
      this.discoveredThisMonth = 0;
      this.totalScanned = 0;
      this.error = null;
      console.log('Scanned products data cleared from store.');
    }
  },
});
