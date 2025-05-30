// src/store/scanStore.ts
import { defineStore } from 'pinia';
import type { ProductInteraction } from '../types';

export type ScanViewStage = 'idle_choice' | 'inputting_barcode' | 'analyzing' | 'result_reviewed' | 'result_new' | 'error';

export interface ScanStoreState {
  currentStage: ScanViewStage;
  productForDisplay: ProductInteraction | Partial<ProductInteraction> | null; 
  isLoadingAnalysis: boolean;
  analysisError: string | null;
  scannedBarcodeValue: string; 
}

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
    clearScanDataOnLogout() { 
        this.resetScanView();
    }
  },
});
