// src/services/scanService.ts
import type { ProductInteraction, AiHealthConclusion, ApiProductResult, FetchStatus } from '../types';
import apiClient from './apiClient'; // Your FastAPI backend client
import axios from 'axios'; // For Open Food Facts

const generateMockId = (prefix: string = 'item_') => `${prefix}${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

/**
 * Fetches product data, trying backend first, then Open Food Facts.
 * @param barcode - The product barcode.
 * @returns A Promise resolving to an ApiProductResult object.
 */
export const fetchProductDataViaBarcode = async (barcode: string): Promise<ApiProductResult> => {
  console.log(`ScanService: Fetching data for barcode: ${barcode}`);
  
  // 1. Try backend API first
  try {
    const backendResponse = await apiClient.get(`/products/barcode/${barcode}`);
    if (backendResponse.data && backendResponse.data.code === 200 && backendResponse.data.data) {
      const productData = backendResponse.data.data;
      console.log('FlavorPal API: Product found -', productData.name);
      return {
        id: productData.id.toString(), // Use backend's product ID
        barcode: barcode,
        name: productData.name || 'Unknown Product Name',
        genericName: productData.generic_name,
        ingredientsText: productData.ingredients,
        imageUrl: productData.image_url, // Add if backend returns these
        categories: productData.categories ? productData.categories.split(',') : [],
        brands: productData.brands ? productData.brands.split(',') : [],
        dateScanned: new Date().toISOString(),
        isReviewed: false, // This will be checked against historyStore later
        fetchStatus: 'found_in_own_db',
      };
    }
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      console.log('FlavorPal API: Product not found by barcode, trying Open Food Facts.');
    } else {
      console.error('FlavorPal API: Error fetching product by barcode:', error);
      // Don't immediately return api_error, try Open Food Facts as a fallback
    }
  }

  // 2. If not found in backend or if backend call failed for non-404 reasons, try Open Food Facts
  console.log(`Open Food Facts API: Fetching data for barcode: ${barcode}`);
  try {
    const offResponse = await axios.get(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`);
    if (offResponse.data && offResponse.data.status === 1 && offResponse.data.product) {
      const productData = offResponse.data.product;
      console.log('Open Food Facts API: Product found -', productData.product_name);
      return {
        id: barcode, // Use barcode as ID for items only found on OFF initially
        barcode: barcode,
        name: productData.product_name_en || productData.product_name || productData.generic_name_en || productData.generic_name || 'Unknown Product Name',
        imageUrl: productData.image_front_small_url || productData.image_front_url || productData.image_url,
        ingredientsText: productData.ingredients_text_en || productData.ingredients_text_ja || productData.ingredients_text,
        categories: productData.categories_tags?.map((tag: string) => tag.replace(/^[a-z]{2}:/, '')),
        brands: productData.brands_tags || (productData.brands ? productData.brands.split(',') : []),
        genericName: productData.generic_name_en || productData.generic_name,
        dateScanned: new Date().toISOString(),
        isReviewed: false,
        fetchStatus: 'found_in_off',
      };
    } else {
      console.log('Open Food Facts API: Product not found for barcode:', barcode);
      return { 
        id: barcode, // Still return barcode so user can manually review if they wish
        name: `Product (Barcode: ${barcode})`,
        barcode: barcode,
        dateScanned: new Date().toISOString(),
        aiHealthSummary: 'Product not found in public databases.',
        aiHealthConclusion: 'info_needed',
        isReviewed: false,
        fetchStatus: 'not_found_anywhere',
      };
    }
  } catch (error) {
    console.error('Open Food Facts API: Error fetching product data:', error);
    return {
        id: barcode, 
        name: `Product (Barcode: ${barcode})`,
        barcode: barcode,
        dateScanned: new Date().toISOString(),
        aiHealthSummary: 'Error connecting to product databases. Please check internet or try again.',
        aiHealthConclusion: 'error_analyzing',
        isReviewed: false,
        fetchStatus: 'api_error',
    };
  }
};

/**
 * Processes a scan (barcode or photo).
 * @param inputType - 'barcode' or 'photo'.
 * @param barcodeValue - Optional: The scanned barcode string.
 * @returns A Promise resolving to an ApiProductResult.
 */
export const processScanOrPhoto = async (
  inputType: 'barcode' | 'photo',
  barcodeValue?: string 
): Promise<ApiProductResult> => { 
  
  if (inputType === 'barcode' && barcodeValue) {
    return await fetchProductDataViaBarcode(barcodeValue);
  }

  // MOCK logic for 'photo'
  console.log('Scan Service: Using mock logic for photo.');
  await new Promise(resolve => setTimeout(resolve, 1000)); 

  const newProductNames = ["Mystery Snack Box (Photo)", "Artisan Drink (Photo)"];
  const randomName = newProductNames[Math.floor(Math.random() * newProductNames.length)];
  const conclusions: AiHealthConclusion[] = ['good', 'caution', 'info_needed'];
  const randomConclusion = conclusions[Math.floor(Math.random() * conclusions.length)];

  const photoData: Partial<ProductInteraction> = {
    id: generateMockId('photo_'), 
    name: randomName,
    dateScanned: new Date().toISOString(),
    aiHealthSummary: `Photo analysis suggests: ${randomName}. Ingredients are unclear from photo.`,
    aiHealthConclusion: randomConclusion,
    isReviewed: false,
    ingredientsText: "Ingredients not available from photo scan.", // Mock
  };
  return { ...photoData, fetchStatus: 'photo_mock', id: photoData.id! } as ApiProductResult;
};