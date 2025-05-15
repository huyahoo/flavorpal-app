// src/store/scannedProductsStore.ts
import { defineStore } from 'pinia';
// MODIFIED: Changed ScannedItem to ProductInteraction
import type { ProductInteraction } from '../types'; 
import { fetchRecentScansApi, fetchScanStatisticsApi } from '../services/scannedProductsService';

export interface ScannedProductsStoreState {
  recentScans: ProductInteraction[]; // MODIFIED
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
    // MODIFIED: Returns ProductInteraction[]
    getSummaryRecentScans: (state) => (count: number = 3): ProductInteraction[] => { 
      return state.recentScans.slice(0, count);
    },
  },

  actions: {
    async loadRecentScans(forceReload: boolean = false) {
      // ... (logic remains the same, type of 'scans' is now ProductInteraction[])
      this.loadingScans = true;
      this.error = null;
      try {
        const scans = await fetchRecentScansApi();
        this.recentScans = scans; // scans is ProductInteraction[]
      } catch (err: any) {
        this.error = err.message || 'Failed to load recent scans.';
        this.recentScans = []; 
      } finally {
        this.loadingScans = false;
      }
    },

    async loadScanStatistics(forceReload: boolean = false) {
      // ... (logic remains the same)
      this.loadingStats = true;
      try {
        const stats = await fetchScanStatisticsApi();
        this.discoveredThisMonth = stats.discoveredThisMonth;
        this.totalScanned = stats.totalScanned;
      } catch (err: any) {
        this.error = (this.error ? this.error + '; ' : '') + (err.message || 'Failed to load scan statistics.');
      } finally {
        this.loadingStats = false;
      }
    },

    // MODIFIED: newItem is ProductInteraction
    addScannedItem(newItem: ProductInteraction) { 
        this.recentScans.unshift(newItem);
        this.totalScanned++;
        // ... (rest of logic)
    },

    clearScannedProductsData() {
      this.recentScans = [];
      this.discoveredThisMonth = 0;
      this.totalScanned = 0;
      this.error = null;
    }
  },
});
