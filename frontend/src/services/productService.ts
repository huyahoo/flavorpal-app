// frontend/src/services/productService.ts
import apiClient from './apiClient';
import type { 
    Product, 
    ApiResponse,
    AiHealthConclusion,
    FetchStatus
} from '../types';

/**
 * Creates a new product.
 * Endpoint: POST /products/
 * @param payload - The product data to create.
 * @returns The created product.
 */
export const createProductApi = async (payload: Product): Promise<ApiResponse<Product>> => {
  console.log("SERVICE (createProductApi): Creating product with payload:", payload);
  try {
    const response = await apiClient.post<ApiResponse<Product>>('/products/', payload);
    console.log("SERVICE (createProductApi): API call response:", response);
    return response.data;
  } catch (error: any) {
    console.log("SERVICE (createProductApi): API call failed:", error);
    console.error("SERVICE (createProductApi): API call failed:", error.response?.data || error.message);
    return { code: error.response?.status || 500, msg: error.response?.data?.detail || error.response?.data?.msg || "Failed to create product." };
  }
};

// get all products
/**
 * Fetches all products.
 * Endpoint: GET /products/
 * @returns The products.
 */
export const getAllProductsApi = async (): Promise<ApiResponse<Product[]>> => {
  console.log("SERVICE (getAllProductsApi): Fetching all products...");
  const response = await apiClient.get<ApiResponse<Product[]>>('/products/');
  return response.data;
};

/**
 * Fetches a product by its barcode.
 * Endpoint: GET /products/barcode/{barcode}
 * @param barcode - The barcode of the product to fetch.
 * @returns The product.
 */
export const getProductByBarcodeApi = async (barcode: string): Promise<ApiResponse<Product>> => {
  console.log(`SERVICE (getProductByBarcodeApi): Fetching product by barcode ${barcode}...`);
  try {
    const response = await apiClient.get<ApiResponse<BackendBasicProductData>>(`/products/barcode/${barcode}`);
    return response.data;
  } catch (error: any) {
    console.error(`SERVICE (getProductByBarcodeApi): API call failed for barcode ${barcode}:`, error.response?.data || error.message);
    return { code: error.response?.status || 500, msg: error.response?.data?.detail || error.response?.data?.msg || `Failed to fetch product by barcode ${barcode}.` };
  }
};

/**
 * Fetches a product by its ID.
 * Endpoint: GET /products/{product_id}
 * @param productId - The ID of the product to fetch.
 * @returns The product.
 */
export const getProductByIdApi = async (productId: number): Promise<ApiResponse<Product>> => {
  console.log(`SERVICE (getProductByIdApi): Fetching product ID ${productId}...`);
  const response = await apiClient.get<ApiResponse<Product>>(`/products/${productId}`);
  return response.data;
};

/**
 * Deletes a product.
 * Endpoint: DELETE /products/{product_id}
 * @param productId - The ID of the product to delete.
 * @returns The deleted product.
 */
export const deleteProductApi = async (productId: number): Promise<ApiResponse<null>> => {
  console.log(`SERVICE (deleteProductApi): Deleting product ID ${productId}`);
  try {
    const response = await apiClient.delete(`/products/${productId}`);
    return response.data;
  } catch (error: any) {
    console.error("SERVICE (deleteProductApi): API call failed:", error.response?.data || error.message);
    return { 
      code: error.response?.status || 500, 
      msg: error.response?.data?.detail || error.response?.data?.msg || `Failed to delete product ${productId}.`,
      data: null
    };
  }
};

// update product
/**
 * Updates a product.
 * Endpoint: PATCH /products/{product_id}
 * @param productId - The ID of the product to update.
 * @param payload - The product data to update.
 * @returns The updated product.
 */
export const updateProductApi = async (productId: number, payload: Product): Promise<ApiResponse<Product>> => {
  console.log(`SERVICE (updateProductApi): Updating product ID ${productId} with payload:`, payload);
  const response = await apiClient.patch<ApiResponse<Product>>(`/products/${productId}`, payload);
  return response.data;
};