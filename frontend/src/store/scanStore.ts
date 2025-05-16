// src/store/scanStore.ts
import { defineStore } from 'pinia';
import type { ProductInteraction, AiHealthConclusion } from '../types';
// Ensure OpenFoodFactsResult is imported if it's a distinct type, or rely on Partial<ProductInteraction>
import { mockProcessScanOrPhoto, type OpenFoodFactsResult } from '../services/scanService'; 
import { useHistoryStore } from './historyStore';
import { useAuthStore } from './auth';

export type ScanViewStage = 'idle_choice' | 'inputting_barcode' | 'analyzing' | 'result_reviewed' | 'result_new' | 'result_not_found' | 'error';

export interface ScanStoreState {
  currentStage: ScanViewStage;
  productForDisplay: ProductInteraction | Partial<ProductInteraction> | null; // Can be partial if not found but barcode is known
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
        const serviceResult = await mockProcessScanOrPhoto(inputType, effectiveBarcode);
        const scannedDataPartial = serviceResult as OpenFoodFactsResult; // Type assertion

        if (!scannedDataPartial) { // Handle case where service might return null/undefined
            throw new Error("Could not retrieve product information from service.");
        }
        
        // If product not found in OFF DB or API error, but we have barcode info
        if (scannedDataPartial.fetchStatus === 'not_found_in_db' || scannedDataPartial.fetchStatus === 'api_error') {
            this.productForDisplay = { // Set minimal info for display
                id: scannedDataPartial.id || effectiveBarcode || generateInteractionId('unknown_'),
                name: scannedDataPartial.name || `Product (Barcode: ${effectiveBarcode || 'N/A'})`,
                barcode: effectiveBarcode,
                dateScanned: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                aiHealthSummary: scannedDataPartial.aiHealthSummary || "Product information could not be retrieved.",
                aiHealthConclusion: scannedDataPartial.aiHealthConclusion || 'info_needed',
                isReviewed: false, // Not found, so definitely not reviewed from this scan
            };
            // DO NOT save to historyStore yet.
            this.currentStage = 'result_new'; // Or a new 'result_not_found_in_db' stage
            this.isLoadingAnalysis = false;
            this.scannedBarcodeValue = '';
            return; // End processing here for not_found or api_error
        }

        // Proceed if product was 'found' by the service (either OFF or photo mock)
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
            finalAiSummary = `No flagged ingredients found. ${scannedDataPartial.aiHealthSummary || ''}`.trim();
            if (scannedDataPartial.aiHealthConclusion !== 'error_analyzing' && scannedDataPartial.aiHealthConclusion !== 'info_needed') {
                 finalAiConclusion = 'good';
            }
          }
        } else if (authStore.healthFlags.length > 0 && !scannedDataPartial.ingredientsText && scannedDataPartial.aiHealthConclusion !== 'error_analyzing') {
            finalAiSummary = "Ingredient information not available for detailed analysis.";
            finalAiConclusion = 'info_needed';
        }
        
        const historyStore = useHistoryStore();
        if (historyStore.allProductInteractions.length === 0 && !historyStore.loadingInteractions) {
            await historyStore.loadProductInteractions(true); 
        }

        let existingHistoryItem: ProductInteraction | undefined = undefined;
        // Use the ID from scannedDataPartial if it exists (e.g., barcode from OFF)
        const idToSearch = scannedDataPartial.id || effectiveBarcode; 

        if (idToSearch) {
            existingHistoryItem = historyStore.getProductInteractionById(idToSearch);
        }
        // If not found by ID, and we have an effectiveBarcode that's different, try that
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
            // isReviewed, userRating, etc., are preserved from existingHistoryItem
          };
        } else {
          // This is for a product successfully identified by the service (e.g. OFF) but new to user's history
          productToDisplayAndSave = {
            id: idToSearch || generateInteractionId('prod_'), // Use ID from service or generate
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
        
        // Only add to history if it was successfully 'found' by the service
        if (scannedDataPartial.fetchStatus === 'found') {
            historyStore.addOrUpdateInteraction(productToDisplayAndSave);
        }
        
        this.productForDisplay = productToDisplayAndSave;

        if (productToDisplayAndSave.isReviewed) {
          this.currentStage = 'result_reviewed';
        } else {
          // This covers both 'found but not reviewed' and 'not_found_in_db' (where user might want to add review)
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

    // ... (cancelAnalysis, resetScanView, prepareForProductDetail, prepareForAddReview, clearScanDataOnLogout remain the same)
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
