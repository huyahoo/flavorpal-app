// src/services/scanService.ts
import type { ProductInteraction, AiHealthConclusion } from '../types';
import { useHistoryStore } from '../store/historyStore'; // To check against existing items

// Helper to generate a new mock ID
const generateMockId = (prefix: string = 'scan_') => `${prefix}${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

/**
 * Simulates processing a scan or photo.
 * Randomly determines if the product is new, already scanned, or already reviewed.
 * @param inputType - 'barcode' or 'photo'.
 * @returns A Promise resolving to a Partial<ProductInteraction> object.
 * This object might have an existing 'id' if the product is "found" in a mock database.
 */
export const mockProcessScanOrPhoto = async (inputType: 'barcode' | 'photo'): Promise<Partial<ProductInteraction>> => {
  console.log(`Mock API Call: Processing ${inputType}...`);
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1500)); // Simulate analysis time

  // For mock purposes, let's try to sometimes return an existing item from history
  // to simulate scanning something already known.
  const historyStore = useHistoryStore();
  if (historyStore.allProductInteractions.length === 0) {
    // Ensure history is loaded if we want to potentially "find" an existing item
    // This is a bit of a hack for a mock service; ideally, the service wouldn't directly depend on UI store state.
    // For a real backend, it would query its own database.
    await historyStore.loadProductInteractions(true); // Force reload for this mock scenario
  }

  const chance = Math.random();
  let scannedData: Partial<ProductInteraction> = {};

  if (chance < 0.3 && historyStore.allProductInteractions.length > 0) {
    // Simulate finding an existing product that IS REVIEWED
    const reviewedItems = historyStore.allProductInteractions.filter(item => item.isReviewed);
    if (reviewedItems.length > 0) {
        const existingItem = reviewedItems[Math.floor(Math.random() * reviewedItems.length)];
        console.log('Mock Scan: Found an existing REVIEWED item:', existingItem.name);
        scannedData = { 
            id: existingItem.id, // Important: use existing ID
            name: existingItem.name,
            barcode: existingItem.barcode || generateMockId('bc_'),
            // AI insights might be re-fetched or could be stale, for mock let's keep them
            aiHealthSummary: existingItem.aiHealthSummary || "Re-analyzed: Still looks good!",
            aiHealthConclusion: existingItem.aiHealthConclusion || 'good',
        };
        // isReviewed will be determined by the store by checking historyStore
        return scannedData;
    }
  } else if (chance < 0.6 && historyStore.allProductInteractions.length > 0) {
    // Simulate finding an existing product that was SCANNED BUT NOT REVIEWED
    const scannedOnlyItems = historyStore.allProductInteractions.filter(item => !item.isReviewed);
     if (scannedOnlyItems.length > 0) {
        const existingItem = scannedOnlyItems[Math.floor(Math.random() * scannedOnlyItems.length)];
        console.log('Mock Scan: Found an existing SCANNED (not reviewed) item:', existingItem.name);
        scannedData = {
            id: existingItem.id, // Important: use existing ID
            name: existingItem.name,
            barcode: existingItem.barcode || generateMockId('bc_'),
            aiHealthSummary: existingItem.aiHealthSummary || "This product was scanned before. Seems okay.",
            aiHealthConclusion: existingItem.aiHealthConclusion || 'neutral',
        };
        return scannedData;
    }
  }

  // Simulate scanning a completely new product
  console.log('Mock Scan: Detected a new product.');
  const newProductNames = ["Exotic Berry Mix", "Artisan Keto Crackers", "Cold Brew Coffee Concentrate", "Spicy Seaweed Snacks", "Vegan Protein Bar - Chocolate Mint"];
  const randomName = newProductNames[Math.floor(Math.random() * newProductNames.length)];
  const conclusions: AiHealthConclusion[] = ['good', 'caution', 'avoid', 'neutral', 'info_needed'];
  const randomConclusion = conclusions[Math.floor(Math.random() * conclusions.length)];

  scannedData = {
    // No 'id' initially, store will generate or assign if it's truly new after checking history
    name: randomName,
    dateScanned: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    aiHealthSummary: `Contains interesting ingredients. Our AI thinks this is generally ${randomConclusion} for you.`,
    aiHealthConclusion: randomConclusion,
    barcode: generateMockId('new_bc_'),
    isReviewed: false, // Explicitly new, so not reviewed
  };
  return scannedData;
};
