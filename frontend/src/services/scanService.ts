// src/services/scanService.ts
import type { ProductInteraction, AiHealthConclusion } from '../types';
import { useHistoryStore } from '../store/historyStore'; 
import axios from 'axios'; // Import axios

// Helper to generate a new mock ID
const generateMockId = (prefix: string = 'scan_') => `${prefix}${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

/**
 * Fetches product data from the Open Food Facts API using a barcode.
 * @param barcode - The product barcode.
 * @returns A Promise resolving to a Partial<ProductInteraction> object or null if not found/error.
 */
export const fetchProductDataFromOpenFoodFacts = async (barcode: string): Promise<Partial<ProductInteraction> | null> => {
  console.log(`Open Food Facts API: Fetching data for barcode: ${barcode}`);
  try {
    const response = await axios.get(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`);
    
    if (response.data && response.data.status === 1 && response.data.product) {
      const productData = response.data.product;
      console.log('Open Food Facts API: Product found -', productData);

      // Map Open Food Facts data to our ProductInteraction structure
      const interactionData: Partial<ProductInteraction> = {
        id: barcode, // Use barcode as the ID for items fetched from OFF
        name: productData.product_name_en || productData.product_name || productData.generic_name_en || productData.generic_name || 'Unknown Product Name',
        imageUrl: productData.image_front_url || productData.image_url,
        barcode: barcode,
        ingredientsText: productData.ingredients_text_en || productData.ingredients_text,
        categories: productData.categories_tags?.map((tag: string) => tag.replace('en:', '').replace('fr:', '')), // Clean up tags
        brands: productData.brands_tags?.map((tag: string) => tag), // Brands are usually clean
        genericName: productData.generic_name_en || productData.generic_name,
        dateScanned: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        isReviewed: false, // This will be determined by checking against historyStore later
        // AI insights will be generated in the scanStore based on ingredientsText and user's healthFlags
      };
      return interactionData;
    } else {
      console.log('Open Food Facts API: Product not found for barcode:', barcode);
      return { // Return a specific structure for "not found in OFF DB"
        id: barcode,
        name: `Product (BC: ${barcode.slice(0,4)}...${barcode.slice(-4)})`,
        barcode: barcode,
        dateScanned: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        aiHealthSummary: 'Product not found in Open Food Facts database.',
        aiHealthConclusion: 'info_needed',
        isReviewed: false,
      };
    }
  } catch (error) {
    console.error('Open Food Facts API: Error fetching product data:', error);
    // Return a structure indicating an error or inability to fetch
    return {
        id: barcode, // Still return the barcode so it can be potentially added manually
        name: `Product (BC: ${barcode.slice(0,4)}...${barcode.slice(-4)})`,
        barcode: barcode,
        dateScanned: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        aiHealthSummary: 'Could not connect to product database. Please check your internet connection.',
        aiHealthConclusion: 'error_analyzing',
        isReviewed: false,
    };
  }
};


/**
 * Simulates processing a scan (barcode or photo).
 * If barcode is provided, it attempts a lookup using Open Food Facts API.
 * If photo, uses mock logic.
 * @param inputType - 'barcode' or 'photo'.
 * @param barcodeValue - Optional: The scanned barcode string.
 * @returns A Promise resolving to a Partial<ProductInteraction> object.
 */
export const mockProcessScanOrPhoto = async (
  inputType: 'barcode' | 'photo',
  barcodeValue?: string 
): Promise<Partial<ProductInteraction>> => {
  console.log(`Scan Service: Processing ${inputType}${barcodeValue ? ' for barcode: ' + barcodeValue : ''}...`);
  
  if (inputType === 'barcode' && barcodeValue) {
    // Call the real API for barcode scans
    const offData = await fetchProductDataFromOpenFoodFacts(barcodeValue);
    if (offData) return offData;
    // Fallback if API call itself fails critically (though fetchProductDataFromOpenFoodFacts handles some errors)
    return {
        id: barcodeValue,
        name: `Product (BC: ${barcodeValue})`,
        barcode: barcodeValue,
        dateScanned: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        aiHealthSummary: 'Error during product lookup.',
        aiHealthConclusion: 'error_analyzing',
        isReviewed: false,
    };
  }

  // --- Fallback to MOCK logic for 'photo' or if barcode scan fails to call API ---
  // This part simulates finding items already in the user's history or a brand new item
  // For 'photo' scans, this mock logic will be used.
  console.log('Scan Service: Using mock logic for photo or fallback.');
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000)); // Simulate analysis time

  const historyStore = useHistoryStore();
  if (historyStore.allProductInteractions.length === 0 && !historyStore.loading) {
    await historyStore.loadProductInteractions(true); 
  }

  let scannedData: Partial<ProductInteraction> = {};
  const chance = Math.random();

  // ... (The existing random mock logic for photo scans can remain here) ...
  // For brevity, I'll keep the "new product" part of the mock for photos
  console.log('Mock Photo Scan: Detected a new product.');
  const newProductNames = ["Exotic Berry Mix (Photo)", "Artisan Keto Crackers (Photo)", "Cold Brew Coffee (Photo)"];
  const randomName = newProductNames[Math.floor(Math.random() * newProductNames.length)];
  const conclusions: AiHealthConclusion[] = ['good', 'caution', 'avoid', 'neutral', 'info_needed'];
  const randomConclusion = conclusions[Math.floor(Math.random() * conclusions.length)];

  scannedData = {
    // id will be generated by store if truly new
    name: randomName,
    dateScanned: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    aiHealthSummary: `Photo analysis suggests this is ${randomName}. Our AI thinks this is generally ${randomConclusion} for you.`,
    aiHealthConclusion: randomConclusion,
    barcode: generateMockId('photo_bc_'), 
    isReviewed: false,
    // Mock some ingredients for photo scans to test client-side AI summary
    ingredientsText: randomConclusion === 'caution' ? 'Contains sugar, almonds, wheat flour.' : 'Water, natural flavors, citric acid.',
  };
  return scannedData;
};

// fetchScanStatisticsApi remains the same
export const fetchScanStatisticsApi = async (): Promise<{ discoveredThisMonth: number; totalScanned: number }> => {
    console.log('Mock API Call: Fetching Scan Statistics...');
    await new Promise(resolve => setTimeout(resolve, 200));
    return {
        discoveredThisMonth: 7, 
        totalScanned: 42,       
    };
};
