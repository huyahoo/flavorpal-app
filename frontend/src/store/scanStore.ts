// src/store/scanStore.ts
import { defineStore } from 'pinia';
import type { ProductInteraction, AiHealthConclusion } from '../types';
// import { mockProcessScanOrPhoto, type OpenFoodFactsResult } from '../services/scanService';
import { useHistoryStore } from './historyStore';
import { useAuthStore } from './auth';

export type ScanViewStage = 'idle_choice' | 'inputting_barcode' | 'analyzing' | 'result_reviewed' | 'result_new' | 'error';

export interface ScanStoreState {
  currentStage: ScanViewStage;
  productForDisplay: ProductInteraction | Partial<ProductInteraction> | null; 
  isLoadingAnalysis: boolean;
  analysisError: string | null;
  scannedBarcodeValue: string; 
}

// const generateInteractionId = (prefix: string = 'item_') => `${prefix}${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

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

    // async initiateScanProcess(inputType: 'barcode' | 'photo', barcode?: string) {
    //   this.currentStage = 'analyzing';
    //   this.isLoadingAnalysis = true;
    //   this.analysisError = null;
    //   this.productForDisplay = null;

    //   const effectiveBarcode = inputType === 'barcode' ? barcode || this.scannedBarcodeValue : undefined;

    //   if (inputType === 'barcode' && !effectiveBarcode) {
    //     this.analysisError = "Barcode value is missing.";
    //     this.currentStage = 'error';
    //     this.isLoadingAnalysis = false;
    //     return;
    //   }

    //   try {
    //     const serviceResult = await mockProcessScanOrPhoto(inputType, effectiveBarcode);
    //     // Ensure serviceResult is treated as OpenFoodFactsResult for barcode scans
    //     const scannedDataPartial = serviceResult as OpenFoodFactsResult; 

    //     if (!scannedDataPartial) {
    //         throw new Error("Could not retrieve product information from service.");
    //     }
        
    //     // If API error during barcode scan, show error and stop
    //     if (scannedDataPartial.fetchStatus === 'api_error') {
    //         this.analysisError = scannedDataPartial.aiHealthSummary || 'Failed to fetch product data.';
    //         this.currentStage = 'error';
    //         this.isLoadingAnalysis = false;
    //         this.scannedBarcodeValue = '';
    //         return;
    //     }

    //     // Client-Side Mock AI Analysis (if ingredientsText is available)
    //     const authStore = useAuthStore();
    //     let finalAiSummary = scannedDataPartial.aiHealthSummary || "No specific health insights generated.";
    //     let finalAiConclusion = scannedDataPartial.aiHealthConclusion || 'neutral';

    //     if (scannedDataPartial.ingredientsText && authStore.healthFlags.length > 0) {
    //       const ingredientsLower = scannedDataPartial.ingredientsText.toLowerCase();
    //       const foundFlags: string[] = [];
    //       authStore.healthFlags.forEach(flag => {
    //         const flagLower = flag.toLowerCase();
    //         if (ingredientsLower.includes(flagLower)) {
    //           foundFlags.push(flag);
    //         }
    //       });
    //       if (foundFlags.length > 0) {
    //         finalAiSummary = `Caution: Contains ${foundFlags.join(', ')}. ${scannedDataPartial.aiHealthSummary || ''}`.trim();
    //         finalAiConclusion = 'caution';
    //         if (foundFlags.some(f => authStore.healthFlags.some(hf => hf.toLowerCase().includes("avoid") && f.includes(hf.replace("avoid","").trim())))) {
    //              finalAiConclusion = 'avoid';
    //         }
    //       } else {
    //         finalAiSummary = `No flagged ingredients found. ${scannedDataPartial.aiHealthSummary || ''}`.trim();
    //         if (scannedDataPartial.aiHealthConclusion !== 'error_analyzing' && scannedDataPartial.aiHealthConclusion !== 'unknown') {
    //              finalAiConclusion = 'good';
    //         }
    //       }
    //     } else if (authStore.healthFlags.length > 0 && !scannedDataPartial.ingredientsText && scannedDataPartial.aiHealthConclusion !== 'error_analyzing' && scannedDataPartial.aiHealthConclusion !== 'unknown') {
    //         finalAiSummary = "Ingredient information not available for detailed analysis.";
    //         finalAiConclusion = 'unknown';
    //     }
        
    //     const historyStore = useHistoryStore();
    //     if (historyStore.allProductInteractions.length === 0 && !historyStore.loadingInteractions) {
    //         await historyStore.loadProductInteractions(true); 
    //     }

    //     let existingHistoryItem: ProductInteraction | undefined = undefined;
    //     // Use the ID from scannedDataPartial if it exists (e.g., barcode from OFF or generated for photo)
    //     const idToSearch = scannedDataPartial.id || generateInteractionId('unknown_');

    //     existingHistoryItem = historyStore.getProductInteractionById(idToSearch);
        
    //     // If not found by ID, and we have an effectiveBarcode that's different from idToSearch (less likely now), try that
    //     if (!existingHistoryItem && effectiveBarcode && effectiveBarcode !== idToSearch) {
    //         existingHistoryItem = historyStore.allProductInteractions.find(
    //             item => item.barcode === effectiveBarcode
    //         );
    //     }
        
    //     let productToDisplayAndSave: ProductInteraction;

    //     if (existingHistoryItem) {
    //       console.log('Scan matched existing item in history:', existingHistoryItem.name);
    //       productToDisplayAndSave = {
    //         ...existingHistoryItem, 
    //         name: scannedDataPartial.name || existingHistoryItem.name, 
    //         imageUrl: scannedDataPartial.imageUrl || existingHistoryItem.imageUrl,
    //         ingredientsText: scannedDataPartial.ingredientsText || existingHistoryItem.ingredientsText,
    //         categories: scannedDataPartial.categories || existingHistoryItem.categories,
    //         brands: scannedDataPartial.brands || existingHistoryItem.brands,
    //         genericName: scannedDataPartial.genericName || existingHistoryItem.genericName,
    //         dateScanned: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), 
    //         aiHealthSummary: finalAiSummary,
    //         aiHealthConclusion: finalAiConclusion,
    //         // isReviewed, userRating, etc., are preserved from existingHistoryItem
    //       };
    //     } else {
    //       // This is for a product identified by the service (e.g. OFF 'found' or 'not_found_in_db', or a photo) 
    //       // but new to the user's detailed history list.
    //       productToDisplayAndSave = {
    //         id: idToSearch, // Use the determined ID
    //         name: scannedDataPartial.name || 'Unknown Product',
    //         imageUrl: scannedDataPartial.imageUrl,
    //         dateScanned: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    //         barcode: effectiveBarcode, // Store the scanned barcode
    //         ingredientsText: scannedDataPartial.ingredientsText,
    //         categories: scannedDataPartial.categories,
    //         brands: scannedDataPartial.brands,
    //         genericName: scannedDataPartial.genericName,
    //         aiHealthSummary: finalAiSummary,
    //         aiHealthConclusion: finalAiConclusion,
    //         isReviewed: false, // New interaction is not reviewed by default
    //         fetchStatus: scannedDataPartial.fetchStatus, // Persist fetch status if available
    //       } as ProductInteraction; // Assert type as ProductInteraction
    //     }
        
    //     // Only add to history if it was successfully 'found' by the service
    //     if (scannedDataPartial.fetchStatus === 'found') {
    //         historyStore.addOrUpdateInteraction(productToDisplayAndSave);
    //     }
        
    //     this.productForDisplay = productToDisplayAndSave;

    //     if (productToDisplayAndSave.isReviewed) {
    //       this.currentStage = 'result_reviewed';
    //     } else {
    //       // This covers 'found but not reviewed' and 'not_found_in_db' (where user might want to add review)
    //       // and photo scans.
    //       this.currentStage = 'result_new'; 
    //     }

    //   } catch (err: any) {
    //     console.error('Error during scan analysis process:', err);
    //     this.analysisError = err.message || 'Analysis failed. Please try again.';
    //     this.currentStage = 'error';
    //   } finally {
    //     this.isLoadingAnalysis = false;
    //     this.scannedBarcodeValue = ''; 
    //   }
    // },

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
    // prepareForProductDetail(): number | null { 
    //     if (this.productForDisplay?.id) {
    //         return this.productForDisplay.id;
    //     }
    //     return null;
    // },
    // prepareForAddReview(): { scanId: number; productName: string; fromTitle: string } | null {
    //     if (this.productForDisplay && this.productForDisplay.id) {
    //         return {
    //             scanId: this.productForDisplay.id, 
    //             productName: this.productForDisplay.name ?? '',
    //             fromTitle: 'Scan Results'
    //         };
    //     }
    //     return null;
    // },
    clearScanDataOnLogout() { 
        this.resetScanView();
    }
  },
});
