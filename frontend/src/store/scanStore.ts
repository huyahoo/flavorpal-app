// src/store/scanStore.ts
import { defineStore } from 'pinia';
import type { ProductInteraction, AiHealthConclusion, ApiProductResult } from '../types';
import { processScanOrPhoto } from '../services/scanService'; 
import { useHistoryStore } from './historyStore';
import { useAuthStore } from './auth';

export type ScanViewStage = 'idle_choice' | 'inputting_barcode' | 'analyzing' | 'result_reviewed' | 'result_new' | 'error';

export interface ScanStoreState {
  currentStage: ScanViewStage;
  productForDisplay: ProductInteraction | null; 
  isLoadingAnalysis: boolean;
  analysisError: string | null;
  scannedBarcodeValue: string; 
}

const generateInteractionId = (prefix: string = 'item_') => `${prefix}${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

export const useScanStore = defineStore('scan', {
  state: (): ScanStoreState => ({
    currentStage: 'idle_choice',
    productForDisplay: null,
    isLoadingAnalysis: false,
    analysisError: null,
    scannedBarcodeValue: '',
  }),

  actions: {
    prepareBarcodeScan() {
      this.currentStage = 'inputting_barcode';
      this.scannedBarcodeValue = ''; 
      this.productForDisplay = null;
      this.analysisError = null;
    },

    async initiateScanProcess(inputType: 'barcode' | 'photo', barcode?: string) {
      this.currentStage = 'analyzing';
      this.isLoadingAnalysis = true;
      this.analysisError = null;
      this.productForDisplay = null;
      const effectiveBarcode = inputType === 'barcode' ? barcode || this.scannedBarcodeValue : undefined;

      if (inputType === 'barcode' && !effectiveBarcode) {
        this.analysisError = "Barcode value is missing.";
        this.currentStage = 'error';
        this.isLoadingAnalysis = false;
        return;
      }

      try {
        const serviceResult = await processScanOrPhoto(inputType, effectiveBarcode);

        if (!serviceResult || !serviceResult.id) { // serviceResult.id is now non-optional in ApiProductResult
            this.analysisError = "Product identification failed.";
            this.currentStage = 'error';
            this.isLoadingAnalysis = false;
            return;
        }
        
        if (serviceResult.fetchStatus === 'api_error') {
            this.analysisError = serviceResult.aiHealthSummary || 'Failed to fetch product data.';
            this.currentStage = 'error';
            this.isLoadingAnalysis = false;
            return;
        }

        const authStore = useAuthStore();
        let finalAiSummary = serviceResult.aiHealthSummary || "No specific health insights generated.";
        let finalAiConclusion = serviceResult.aiHealthConclusion || 'neutral';

        if (serviceResult.ingredientsText && authStore.healthFlags.length > 0) {
          // ... (Client-side AI analysis logic as before) ...
          const ingredientsLower = serviceResult.ingredientsText.toLowerCase();
          const foundFlags: string[] = [];
          authStore.healthFlags.forEach(flag => {
            const flagLower = flag.toLowerCase();
            if (ingredientsLower.includes(flagLower)) {
              foundFlags.push(flag);
            }
          });
          if (foundFlags.length > 0) {
            finalAiSummary = `Caution: Contains ${foundFlags.join(', ')}. ${serviceResult.aiHealthSummary || ''}`.trim();
            finalAiConclusion = 'caution';
            if (foundFlags.some(f => authStore.healthFlags.some(hf => hf.toLowerCase().includes("avoid") && f.includes(hf.replace("avoid","").trim())))) {
                 finalAiConclusion = 'avoid';
            }
          } else {
            finalAiSummary = `No flagged ingredients found. ${serviceResult.aiHealthSummary || ''}`.trim();
            if (serviceResult.aiHealthConclusion !== 'error_analyzing' && serviceResult.aiHealthConclusion !== 'info_needed') {
                 finalAiConclusion = 'good';
            }
          }
        } else if (authStore.healthFlags.length > 0 && !serviceResult.ingredientsText && serviceResult.aiHealthConclusion !== 'error_analyzing' && serviceResult.aiHealthConclusion !== 'info_needed') {
            finalAiSummary = "Ingredient information not available for detailed analysis.";
            finalAiConclusion = 'info_needed';
        }
        
        const historyStore = useHistoryStore();
        if (historyStore.allProductInteractions.length === 0 && !historyStore.loadingInteractions) {
            await historyStore.loadProductInteractions(true); 
        }

        let existingHistoryItem = historyStore.getProductInteractionById(serviceResult.id);
        
        let productToDisplayAndSave: ProductInteraction;

        if (existingHistoryItem) {
          productToDisplayAndSave = {
            ...existingHistoryItem, 
            name: serviceResult.name || existingHistoryItem.name, 
            imageUrl: serviceResult.imageUrl || existingHistoryItem.imageUrl,
            ingredientsText: serviceResult.ingredientsText || existingHistoryItem.ingredientsText,
            categories: serviceResult.categories || existingHistoryItem.categories,
            brands: serviceResult.brands || existingHistoryItem.brands,
            genericName: serviceResult.genericName || existingHistoryItem.genericName,
            dateScanned: new Date().toISOString(), 
            aiHealthSummary: finalAiSummary,
            aiHealthConclusion: finalAiConclusion,
            barcode: effectiveBarcode || existingHistoryItem.barcode,
            // fetchStatus: serviceResult.fetchStatus,
          };
        } else {
          // This item is new to our history (could be from OFF, your DB via barcode, or photo mock)
          productToDisplayAndSave = {
            id: serviceResult.id, // Use ID from service (backend DB ID, barcode, or photo mock ID)
            name: serviceResult.name || 'Unknown Product',
            imageUrl: serviceResult.imageUrl,
            dateScanned: new Date().toISOString(),
            barcode: effectiveBarcode,
            ingredientsText: serviceResult.ingredientsText,
            categories: serviceResult.categories,
            brands: serviceResult.brands,
            genericName: serviceResult.genericName,
            aiHealthSummary: finalAiSummary,
            aiHealthConclusion: finalAiConclusion,
            isReviewed: false, 
            // fetchStatus: serviceResult.fetchStatus,
          };
        }
        
        // Add to history if it was successfully identified by any means 
        // (your DB, OFF, or a photo scan that generated data).
        // Do NOT add if fetchStatus was 'api_error'.
        // Items with 'not_found_anywhere' (barcode not in any DB) WILL be added if user proceeds to review.
        // For now, if it's 'not_found_anywhere' but we have a barcode, we create a minimal entry.
        if (productToDisplayAndSave.fetchStatus !== 'api_error') {
            historyStore.addOrUpdateInteraction(productToDisplayAndSave);
        }
        
        this.productForDisplay = productToDisplayAndSave;

        if (productToDisplayAndSave.isReviewed) {
          this.currentStage = 'result_reviewed';
        } else {
          this.currentStage = 'result_new'; 
        }

      } catch (err: any) {
        this.analysisError = err.message || 'Analysis process failed.';
        this.currentStage = 'error';
      } finally {
        this.isLoadingAnalysis = false;
        this.scannedBarcodeValue = ''; 
      }
    },

    cancelAnalysis() { 
        this.isLoadingAnalysis = false;
        this.currentStage = 'idle_choice'; 
        this.analysisError = null;
        this.productForDisplay = null;
        this.scannedBarcodeValue = '';
    },
    resetScanView() { 
        this.currentStage = 'idle_choice';
        this.productForDisplay = null;
        this.isLoadingAnalysis = false;
        this.analysisError = null;
        this.scannedBarcodeValue = '';
    },
    prepareForProductDetail(): string | null { 
        if (this.productForDisplay?.id) {
            return this.productForDisplay.id;
        }
        return null;
    },
    prepareForAddReview(): { scanId: string; productName: string; fromTitle: string } | null {
        if (this.productForDisplay && this.productForDisplay.id) {
            return {
                scanId: this.productForDisplay.id, 
                productName: this.productForDisplay.name ?? '',
                fromTitle: 'Scan Results'
            };
        }
        return null;
     },
    clearScanDataOnLogout() { 
        this.resetScanView();
    }
  },
});
