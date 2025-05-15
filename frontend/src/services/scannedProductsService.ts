// src/services/scannedProductsService.ts
import type { ScannedItem, AiHealthConclusion } from '../types';

/**
 * Simulates fetching recently scanned items for the user from an API.
 * Includes mock AI-generated health summaries and conclusions.
 * @returns A Promise that resolves to an array of ScannedItem objects.
 */
export const fetchRecentScansApi = async (): Promise<ScannedItem[]> => {
  console.log('Mock API Call: Fetching Recent Scans...');
  await new Promise(resolve => setTimeout(resolve, 700)); // Simulate network delay

  const mockScans: ScannedItem[] = [
    {
      id: 'scan001',
      name: 'Organic Sprouted Wheat Bread',
      imageUrl: 'https://placehold.co/100x100/A98B72/FFFFFF?text=Bread&font=roboto',
      dateScanned: 'May 15, 2025',
      aiHealthSummary: 'Contains wheat. Generally healthy, good source of fiber.',
      aiHealthConclusion: 'good',
      barcode: '1234567890123',
    },
    {
      id: 'scan002',
      name: 'Sweet & Salty Peanut Butter Puffs',
      imageUrl: 'https://placehold.co/100x100/F5BF41/FFFFFF?text=Puffs&font=roboto',
      dateScanned: 'May 15, 2025',
      aiHealthSummary: 'Contains peanuts and high sugar content. Be mindful of portion size.',
      aiHealthConclusion: 'caution',
      barcode: '9876543210987',
    },
    {
      id: 'scan003',
      name: 'Zero Sugar Sparkling Water (Lemon)',
      imageUrl: 'https://placehold.co/100x100/C1E1FF/000000?text=Water&font=roboto',
      dateScanned: 'May 14, 2025',
      aiHealthSummary: 'No flagged ingredients. Appears suitable for your profile.',
      aiHealthConclusion: 'good',
    },
    {
      id: 'scan004',
      name: 'Instant Noodles - Spicy Beef Flavor',
      dateScanned: 'May 13, 2025',
      aiHealthSummary: 'High in sodium and contains MSG. May not align with low-sodium preferences.',
      aiHealthConclusion: 'avoid', // Assuming user has a 'low sodium' flag
    },
     {
      id: 'scan005',
      name: 'Imported Cheese Selection (Unknown Type)',
      imageUrl: 'https://placehold.co/100x100/FFF3B0/000000?text=Cheese&font=roboto',
      dateScanned: 'May 12, 2025',
      aiHealthSummary: 'Contains dairy. Ingredient list not fully processed or available.',
      aiHealthConclusion: 'info_needed',
    },
  ];
  return mockScans;
};

/**
 * Simulates fetching user's scanning statistics.
 * @returns A Promise that resolves to an object with scan statistics.
 */
export const fetchScanStatisticsApi = async (): Promise<{ discoveredThisMonth: number; totalScanned: number }> => {
    console.log('Mock API Call: Fetching Scan Statistics...');
    await new Promise(resolve => setTimeout(resolve, 200));
    return {
        discoveredThisMonth: 7, // Example value
        totalScanned: 42,       // Example value
    };
};
