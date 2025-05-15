// src/services/scannedProductsService.ts
// MODIFIED: Changed ScannedItem to ProductInteraction
import type { ProductInteraction, AiHealthConclusion } from '../types'; 
import { useHistoryStore } from '../store/historyStore'; 

const generateMockId = (prefix: string = 'scan_') => `${prefix}${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

/**
 * Simulates fetching recently scanned items for the user from an API.
 * Includes mock AI-generated health summaries and conclusions.
 * @returns A Promise that resolves to an array of ProductInteraction objects.
 */
// MODIFIED: Return type is now Promise<ProductInteraction[]>
export const fetchRecentScansApi = async (): Promise<ProductInteraction[]> => { 
  console.log('Mock API Call: Fetching Recent Scans...');
  await new Promise(resolve => setTimeout(resolve, 700)); 

  // MODIFIED: mockScans now uses ProductInteraction type
  const mockScans: ProductInteraction[] = [ 
    {
      id: 'scan001',
      name: 'Organic Sprouted Wheat Bread',
      imageUrl: 'https://placehold.co/100x100/A98B72/FFFFFF?text=Bread&font=roboto',
      dateScanned: 'May 15, 2025',
      aiHealthSummary: 'Contains wheat. Generally healthy, good source of fiber.',
      aiHealthConclusion: 'good',
      barcode: '1234567890123',
      isReviewed: false, // Explicitly not reviewed from a scan perspective
    },
    {
      id: 'scan002',
      name: 'Sweet & Salty Peanut Butter Puffs',
      imageUrl: 'https://placehold.co/100x100/F5BF41/FFFFFF?text=Puffs&font=roboto',
      dateScanned: 'May 15, 2025',
      aiHealthSummary: 'Contains peanuts and high sugar content. Be mindful of portion size.',
      aiHealthConclusion: 'caution',
      barcode: '9876543210987',
      isReviewed: false,
    },
    {
      id: 'scan003',
      name: 'Zero Sugar Sparkling Water (Lemon)',
      imageUrl: 'https://placehold.co/100x100/C1E1FF/000000?text=Water&font=roboto',
      dateScanned: 'May 14, 2025',
      aiHealthSummary: 'No flagged ingredients. Appears suitable for your profile.',
      aiHealthConclusion: 'good',
      isReviewed: false,
    },
    // ... other mock items should also conform to ProductInteraction and have isReviewed: false
  ];
  return mockScans;
};

export const fetchScanStatisticsApi = async (): Promise<{ discoveredThisMonth: number; totalScanned: number }> => {
    console.log('Mock API Call: Fetching Scan Statistics...');
    await new Promise(resolve => setTimeout(resolve, 200));
    return {
        discoveredThisMonth: 7, 
        totalScanned: 42,       
    };
};
