// src/store/scanStore.ts
import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';
import type { ProductInteraction, AiHealthConclusion } from '../types';
import { mockProcessScanOrPhoto } from '../services/scanService';
import { useHistoryStore } from './historyStore';

export type ScanViewStage = 'idle_choice' | 'analyzing' | 'result_reviewed' | 'result_new' | 'error';

export interface ScanStoreState {
  currentStage: ScanViewStage;
  productForDisplay: ProductInteraction | null; // Holds the fully resolved product for UI
  isLoadingAnalysis: boolean;
  analysisError: string | null;
}

// Helper to generate a new mock ID if one isn't found from scanService
const generateInteractionId = (prefix: string = 'item_') => `${prefix}${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;


export const useScanStore = defineStore('scan', {
  state: (): ScanStoreState => ({
    currentStage: 'idle_choice',
    productForDisplay: null,
    isLoadingAnalysis: false,
    analysisError: null,
  }),

  actions: {
    async initiateScanProcess(inputType: 'barcode' | 'photo') {
      this.currentStage = 'analyzing';
      this.isLoadingAnalysis = true;
      this.analysisError = null;
      this.productForDisplay = null;

      try {
        const scannedData = await mockProcessScanOrPhoto(inputType);
        const historyStore = useHistoryStore();

        // Ensure history is loaded to check against
        if (historyStore.allProductInteractions.length === 0) {
            await historyStore.loadProductInteractions(true); // Force load if empty
        }

        let existingHistoryItem: ProductInteraction | undefined = undefined;

        // Try to find by ID (if scanService returned one) or by barcode
        if (scannedData.id) {
            existingHistoryItem = historyStore.getProductInteractionById(scannedData.id);
        }
        if (!existingHistoryItem && scannedData.barcode) {
            existingHistoryItem = historyStore.allProductInteractions.find(
                item => item.barcode === scannedData.barcode
            );
        }
        // More sophisticated matching could be added (e.g., by name, if OCR is good)

        if (existingHistoryItem) {
          console.log('Scan matched existing item in history:', existingHistoryItem.name);
          this.productForDisplay = { ...existingHistoryItem }; // Use the full item from history

          // Potentially update the matched item with fresh AI insights or new scan date
          const updatedInteraction = {
            ...existingHistoryItem,
            dateScanned: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), // Update scan date
            aiHealthSummary: scannedData.aiHealthSummary || existingHistoryItem.aiHealthSummary, // Prefer fresh AI summary
            aiHealthConclusion: scannedData.aiHealthConclusion || existingHistoryItem.aiHealthConclusion,
          };
          historyStore.updateProductInteraction(updatedInteraction); // Update in history
          this.productForDisplay = updatedInteraction; // Display the updated one

          if (existingHistoryItem.isReviewed) {
            this.currentStage = 'result_reviewed';
          } else {
            this.currentStage = 'result_new'; // It's known but not reviewed by user
          }
        } else {
          // Product is new or not found by ID/barcode in current history
          console.log('Scan resulted in a new product:', scannedData.name);
          const newProductInteraction: ProductInteraction = {
            id: scannedData.id || generateInteractionId('prod_'), // Use scanned ID or generate new
            name: scannedData.name || 'Unknown Product',
            imageUrl: scannedData.imageUrl,
            dateScanned: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            aiHealthSummary: scannedData.aiHealthSummary,
            aiHealthConclusion: scannedData.aiHealthConclusion,
            barcode: scannedData.barcode,
            isReviewed: false, // Definitely not reviewed yet
            // userRating, userNotes, dateReviewed will be undefined
          };
          historyStore.updateProductInteraction(newProductInteraction); // Add to history
          this.productForDisplay = newProductInteraction;
          this.currentStage = 'result_new';
        }

      } catch (err: any) {
        console.error('Error during scan analysis:', err);
        this.analysisError = err.message || 'Analysis failed. Please try again.';
        this.currentStage = 'error';
      } finally {
        this.isLoadingAnalysis = false;
      }
    },

    cancelAnalysis() {
      this.isLoadingAnalysis = false;
      this.currentStage = 'idle_choice';
      this.analysisError = null;
      this.productForDisplay = null;
    },

    resetScanView() {
      this.currentStage = 'idle_choice';
      this.productForDisplay = null;
      this.isLoadingAnalysis = false;
      this.analysisError = null;
    },

    navigateToProductDetail() {
      if (this.productForDisplay?.id) {
        const router = useRouter(); 
        router.push({ name: 'ProductDetail', params: { id: this.productForDisplay.id } });
      }
    },

    navigateToAddReview() {
      if (this.productForDisplay) {
        const router = useRouter(); 
        router.push({ 
            name: 'AddReview', 
            query: { 
                scanId: this.productForDisplay.id, 
                productName: this.productForDisplay.name,
                fromTitle: 'Scan Results' 
            } 
        });
      }
    },

    clearScanDataOnLogout() {
        this.resetScanView();
    }
  },
});
