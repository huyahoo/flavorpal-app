// src/store/scanStore.ts
import { defineStore } from 'pinia';
// REMOVED: import { useRouter } from 'vue-router'; 
import type { ProductInteraction, AiHealthConclusion } from '../types';
import { mockProcessScanOrPhoto } from '../services/scanService';
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
        const scannedDataPartial = await mockProcessScanOrPhoto(inputType, effectiveBarcode);

        if (!scannedDataPartial || !scannedDataPartial.name) {
            throw new Error(scannedDataPartial.aiHealthSummary || "Could not retrieve product information.");
        }

        const authStore = useAuthStore();
        let finalAiSummary = scannedDataPartial.aiHealthSummary || "No specific health insights generated.";
        let finalAiConclusion = scannedDataPartial.aiHealthConclusion || 'neutral';

        if (scannedDataPartial.ingredientsText && authStore.healthFlags.length > 0) {
          const ingredientsLower = scannedDataPartial.ingredientsText.toLowerCase();
          const foundFlags: string[] = [];
          authStore.healthFlags.forEach(flag => {
            const flagLower = flag.toLowerCase();
            if (ingredientsLower.includes(flagLower)) {
              foundFlags.push(flag);
            }
          });

          if (foundFlags.length > 0) {
            finalAiSummary = `Caution: Contains ${foundFlags.join(', ')}. ${scannedDataPartial.aiHealthSummary || ''}`.trim();
            finalAiConclusion = 'caution';
            if (foundFlags.some(f => authStore.healthFlags.some(hf => hf.toLowerCase().includes("avoid") && f.includes(hf.replace("avoid","").trim())))) {
                 finalAiConclusion = 'avoid';
            }
          } else {
            finalAiSummary = `No flagged ingredients found based on your profile. ${scannedDataPartial.aiHealthSummary || ''}`.trim();
            if (scannedDataPartial.aiHealthConclusion !== 'error_analyzing' && scannedDataPartial.aiHealthConclusion !== 'info_needed') {
                 finalAiConclusion = 'good';
            }
          }
        } else if (authStore.healthFlags.length > 0 && !scannedDataPartial.ingredientsText && scannedDataPartial.aiHealthConclusion !== 'error_analyzing') {
            finalAiSummary = "Ingredient information not available for detailed analysis against your health flags.";
            finalAiConclusion = 'info_needed';
        }
        
        const historyStore = useHistoryStore();
        if (historyStore.allProductInteractions.length === 0 && !historyStore.loadingInteractions) {
            await historyStore.loadProductInteractions(true); 
        }

        let existingHistoryItem: ProductInteraction | undefined = undefined;
        const idToSearch = scannedDataPartial.id || effectiveBarcode; 

        if (idToSearch) {
            existingHistoryItem = historyStore.getProductInteractionById(idToSearch);
        }
        if (!existingHistoryItem && effectiveBarcode && effectiveBarcode !== idToSearch) {
            existingHistoryItem = historyStore.allProductInteractions.find(
                item => item.barcode === effectiveBarcode
            );
        }

        let productToDisplayAndSave: ProductInteraction;

        if (existingHistoryItem) {
          productToDisplayAndSave = {
            ...existingHistoryItem, 
            name: scannedDataPartial.name || existingHistoryItem.name, 
            imageUrl: scannedDataPartial.imageUrl || existingHistoryItem.imageUrl,
            ingredientsText: scannedDataPartial.ingredientsText || existingHistoryItem.ingredientsText,
            categories: scannedDataPartial.categories || existingHistoryItem.categories,
            brands: scannedDataPartial.brands || existingHistoryItem.brands,
            genericName: scannedDataPartial.genericName || existingHistoryItem.genericName,
            dateScanned: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), 
            aiHealthSummary: finalAiSummary,
            aiHealthConclusion: finalAiConclusion,
          };
        } else {
          productToDisplayAndSave = {
            id: idToSearch || generateInteractionId('prod_'),
            name: scannedDataPartial.name || 'Unknown Product',
            imageUrl: scannedDataPartial.imageUrl,
            dateScanned: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            barcode: effectiveBarcode,
            ingredientsText: scannedDataPartial.ingredientsText,
            categories: scannedDataPartial.categories,
            brands: scannedDataPartial.brands,
            genericName: scannedDataPartial.genericName,
            aiHealthSummary: finalAiSummary,
            aiHealthConclusion: finalAiConclusion,
            isReviewed: false, 
          };
        }
        
        historyStore.addOrUpdateInteraction(productToDisplayAndSave);
        this.productForDisplay = productToDisplayAndSave;

        if (productToDisplayAndSave.isReviewed) {
          this.currentStage = 'result_reviewed';
        } else {
          this.currentStage = 'result_new';
        }

      } catch (err: any) {
        this.analysisError = err.message || 'Analysis failed. Please try again.';
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

    // MODIFIED: These actions now just prepare state or return data.
    // Navigation will be handled by the component.
    prepareForProductDetail(): ProductInteraction | null {
      // This action could do more if needed, e.g., logging, analytics
      // For now, it just confirms the productForDisplay is ready.
      if (this.productForDisplay?.id) {
        return this.productForDisplay;
      }
      console.error('Cannot prepare for product detail: productForDisplay or its ID is null.');
      return null;
    },

    prepareForAddReview(): { id: string, name: string } | null {
      if (this.productForDisplay) {
        return {
            id: this.productForDisplay.id, 
            name: this.productForDisplay.name,
        };
      }
      console.error('Cannot prepare for add review: productForDisplay is null.');
      return null;
    },

    clearScanDataOnLogout() {
        this.resetScanView();
    }
  },
});
