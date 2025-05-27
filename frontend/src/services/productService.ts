// frontend/src/services/productService.ts
import apiClient from './apiClient';
import type { 
    ProductInteraction, 
    ApiResponse,
    AiHealthConclusion,
    FetchStatus,
    ReViewDataPayload
} from '../types';


const convertDateToDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

const mapApiProductToProductInteraction = (product: any): ProductInteraction => {
  return ({
    id: product.id,
    name: product.name,
    barcode: product.barcode,
    brands: product.brands,
    categories: product.categories,
    dateScanned: convertDateToDate(product.data_scanned_at),
    dateReviewed: convertDateToDate(product.data_reviewed),
    isReviewed: product.isReviewed,
    imageUrl: product.image_url,
    userRating: product.user_rating,
    userNotes: product.user_note,
    aiHealthSummary: product.ai_health_summary || "No summary available",
    aiHealthConclusion: product.ai_health_conclusion || "info_needed",
  });
};

/**
 * Creates a new product.
 * Endpoint: POST /products/
 * @param payload - The product data to create.
 * @returns The created product.
 */
export const createProductApi = async (payload: ProductInteraction): Promise<ApiResponse<ProductInteraction>> => {
  console.log("SERVICE (createProductApi): Creating product with payload:", payload);
  try {
    const response = await apiClient.post<ApiResponse<ProductInteraction>>('/products/', payload);
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
export const getAllProductsApi = async (): Promise<ApiResponse<ProductInteraction[]>> => {
  console.log("SERVICE (getAllProductsApi): Fetching all products...");
  const response = await apiClient.get<ApiResponse<ProductInteraction[]>>('/products/');
  console.log("SERVICE (getAllProductsApi): API call response:", response);
  return response.data;
};

/**
 * Fetches a product by its barcode.
 * Endpoint: GET /products/barcode/{barcode}
 * @param barcode - The barcode of the product to fetch.
 * @returns The product.
 */
export const getProductByBarcodeApi = async (barcode: string): Promise<ApiResponse<ProductInteraction>> => {
  console.log(`SERVICE (getProductByBarcodeApi): Fetching product by barcode ${barcode}...`);
  const response = await apiClient.get<ApiResponse<ProductInteraction>>(`/products/product/${barcode}`);
  console.log("SERVICE (getProductByBarcodeApi): API call response:", response);
  const productInteraction = mapApiProductToProductInteraction(response.data.data);
  console.log("SERVICE (getProductByBarcodeApi): API call response:", productInteraction);
  return productInteraction;
};

/**
 * Fetches a product by its ID.
 * Endpoint: GET /products/{product_id}
 * @param productId - The ID of the product to fetch.
 * @returns The product.
 */
export const getProductByIdApi = async (productId: number): Promise<ApiResponse<ProductInteraction>> => {
  console.log(`SERVICE (getProductByIdApi): Fetching product ID ${productId}...`);
  const response = await apiClient.get<ApiResponse<ProductInteraction>>(`/products/${productId}`);
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

/**
 * Updates a product.
 * Endpoint: PATCH /products/{product_id}
 * @param productId - The ID of the product to update.
 * @param payload - The product data to update.
 * @returns The updated product.
 */
export const updateProductApi = async (productId: number, payload: ProductInteraction): Promise<ApiResponse<ProductInteraction>> => {
  console.log(`SERVICE (updateProductApi): Updating product ID ${productId} with payload:`, payload);
  const response = await apiClient.patch<ApiResponse<ProductInteraction>>(`/products/${productId}`, payload);
  return response.data;
};

/**
 * Adds a review for a product.
 * Endpoint: POST /reviews/products/{product_id}
 * @param productId - The ID of the product to add a review for.
 * @param payload - The review data to add.
 * @returns The added review.
 */
export const addReviewForProductApi = async (productId: number, payload: ReViewDataPayload): Promise<ApiResponse<ProductInteraction>> => {
  console.log(`SERVICE (addReviewForProductApi): Adding review for product ID ${productId} with payload:`, payload);
  const response = await apiClient.post<ApiResponse<ProductInteraction>>(`/reviews/products/${productId}`, payload);
  console.log("SERVICE (addReviewForProductApi): API call response:", response);
  return response.data;
};

/**
 * Updates a review for a product.
 * Endpoint: PATCH /reviews/products/{product_id}
 * @param productId - The ID of the product to update the review for.
 * @param payload - The review data to update.
 * @returns The updated review.
 */
export const updateReviewForProductApi = async (productId: number, payload: ReViewDataPayload): Promise<ApiResponse<ProductInteraction>> => {
  console.log(`SERVICE (updateReviewForProductApi): Updating review for product ID ${productId} with payload:`, payload);
  const response = await apiClient.patch<ApiResponse<ProductInteraction>>(`/reviews/products/${productId}`, payload);
  console.log("SERVICE (updateReviewForProductApi): API call response:", response);
  return response.data;
};