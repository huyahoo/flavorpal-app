// src/services/scanService.ts
import type { ProductDetails, Product, AiHealthConclusion, ApiResponse } from '../types';
import { useHistoryStore } from '../store/historyStore';
import { createProductApi, getProductByBarcodeApi } from './productService';
import axios from 'axios'; 

// Add a status to the return type of fetchProductDataFromOpenFoodFacts
export interface OpenFoodFactsResult extends Partial<Product> {
  fetchStatus: 'found' | 'not_found_in_db' | 'api_error';
}

const generateMockId = (prefix: string = 'scan_') => `${prefix}${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

/**
 * Fetches product data from the Open Food Facts API using a barcode.
 * @param barcode - The product barcode.
 * @returns A Promise resolving to an OpenFoodFactsResult object.
 */
export const fetchProductDataFromOpenFoodFacts = async (barcode: string): Promise<OpenFoodFactsResult> => {
  console.log(`Open Food Facts API: Fetching data for barcode: ${barcode}`);
  try {
    const response = await axios.get(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`);
    
    if (response.data && response.data.status === 1 && response.data.product) {
      const productData = response.data.product;
      console.log('Open Food Facts API: Product found -', productData);

      const interactionData: Product = {
        barcode: productData.id,
        name: productData.product_name_en || productData.product_name || productData.generic_name_en || productData.generic_name || 'Unknown Product Name',
        brands: productData.brands,
        imageUrl: productData.image_front_url || productData.image_url,
        imageIngredientsUrl: productData.image_ingredients_url || productData.image_nutrition_thumb_url,
        imageNutritionUrl: productData.image_nutrition_url || productData.image_ingredients_thumb_url,
        categories: productData.categories || null,
        isReviewed: false,
        // likeCount: 0 // Default
        // fetchStatus: 'found'
        // --- Fields NOT directly from OFF product endpoint but needed by Product type:
        // aiHealthSummary: undefined (to be filled by scanStore)
        // aiHealthConclusion: undefined (to be filled by scanStore)
        // userRating: undefined
        // userNotes: undefined
        // dateReviewed: undefined
      };
      // const res = await createProductApi(interactionData);
      // if (res.code === 200 && res.data) {
      //   console.log('Product created successfully:', res.data);
      // } else {
      //   console.error('Failed to create product:', res);
      // }
      // console.log('interactionData', interactionData);

      return { 
        ...interactionData,
        fetchStatus: 'found'
      };
    } else {
      console.log('Open Food Facts API: Product not found for barcode:', barcode);
      return {
        fetchStatus: 'not_found_in_db',
      };
    }
  } catch (error) {
    console.error('Open Food Facts API: Error fetching product data:', error);
    return {
        fetchStatus: 'api_error',
    };
  }
};

// Get product by barcode
export const getProductByBarcode = async (barcode: string): Promise<ApiResponse<Product>> => {
  const response = await getProductByBarcodeApi(barcode);
  console.log('getProductByBarcode', response);
  return response;
};

/**
 * Simulates processing a scan (barcode or photo).
 * If barcode is provided, it attempts a lookup using Open Food Facts API.
 * If photo, uses mock logic.
 * @param inputType - 'barcode' or 'photo'.
 * @param barcodeValue - Optional: The scanned barcode string.
 * @returns A Promise resolving to an OpenFoodFactsResult object (for barcode) or Partial<Product> (for photo).
 */
export const processScanOrPhoto = async (
  inputType: 'barcode' | 'photo',
  barcodeValue: string 
): Promise<OpenFoodFactsResult | Partial<Product>> => { // Return type updated
  console.log(`Scan Service: Processing ${inputType}${barcodeValue ? ' for barcode: ' + barcodeValue : ''}...`);
  
  const productExists = await checkProductExistsInDatabase(barcodeValue);
  if (productExists) {
    console.log('Product exists in database');
    // return await fetchProductDataFromOpenFoodFacts(barcodeValue);
  } else {
    console.log('Product does not exist in database');
  }

  if (inputType === 'barcode' && barcodeValue) {
    return await fetchProductDataFromOpenFoodFacts(barcodeValue);
  }

  // Fallback to MOCK logic for 'photo'
  console.log('Scan Service: Using mock logic for photo.');
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000)); 

  // ... (existing mock logic for photo scan remains the same, returning Partial<Product>)
  // For consistency, you might want it to also return an object with a fetchStatus if it makes sense.
  // For now, the photo scan will just return Partial<Product> as before.
  const historyStore = useHistoryStore();
  if (historyStore.allProductInteractions.length === 0 && !historyStore.loadingInteractions) {
    await historyStore.loadAllProducts(true); 
  }

  let scannedData: Partial<Product> = {};
  // ... (rest of photo mock logic from artifact flavorpal_scan_service_barcode)
  const newProductNames = ["Exotic Berry Mix (Photo)", "Artisan Keto Crackers (Photo)", "Cold Brew Coffee (Photo)"];
  const randomName = newProductNames[Math.floor(Math.random() * newProductNames.length)];
  const conclusions: AiHealthConclusion[] = ['good', 'caution', 'avoid', 'neutral', 'info_needed'];
  const randomConclusion = conclusions[Math.floor(Math.random() * conclusions.length)];

  scannedData = {
    name: randomName,
    dateScanned: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    aiHealthSummary: `Photo analysis suggests this is ${randomName}. Our AI thinks this is generally ${randomConclusion} for you.`,
    aiHealthConclusion: randomConclusion,
    barcode: generateMockId('photo_bc_'), 
    isReviewed: false,
    ingredientsText: randomConclusion === 'caution' ? 'Contains sugar, almonds, wheat flour.' : 'Water, natural flavors, citric acid.',
  };
  // To make it compatible with the expected return type for the store, add a status for photo
  return { ...scannedData, fetchStatus: 'found' } as OpenFoodFactsResult; // Assume photo "finds" something to analyze
};

// fetchScanStatisticsApi remains in historyService.ts
export const mockPhotoAnalyze = async (photoBase64: String) => {
  // Mock timeout
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000)); // Simulate network delay
  const historyStore = useHistoryStore();
  // Hardcode a mock return from history service.
  const mockInteraction = historyStore.getProductInteractionById('hist_item_001')
  if (!mockInteraction) {
    console.error('No mock interaction found for photo analysis.');
    return null; // Or throw an error if preferred
  }
  return mockInteraction;
}