// frontend/src/services/productService.ts
import apiClient from './apiClient';
import type {
    ProductInteraction,
    ApiResponse,
    ReViewDataPayload
} from '../types';
import type { CapturedPhoto } from '@/views/Scan/components/PhotoCapturer.vue';

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
    return {
      code: error.response?.status || 500,
      msg: error.response?.data?.detail || error.response?.data?.msg || "Failed to create product.",
      data: null as unknown as ProductInteraction,
    };
  }
};

/**
 * Get all products of current user
 * Endpoint: GET /products/currentuser/list/products
 * @returns The products.
 */
export const getAllProductsOfCurrentUserApi = async (): Promise<ApiResponse<ProductInteraction[]>> => {
  try {
    console.log("SERVICE (getAllProductsOfCurrentUserApi): Fetching all products of current user...");
    const response = await apiClient.get<ApiResponse<ProductInteraction[]>>('/products/currentuser/list/products');
    console.log("SERVICE (getAllProductsOfCurrentUserApi): API call response:", response);
    return response.data;
  } catch (error: any) {
    console.error("SERVICE (getAllProductsOfCurrentUserApi): API call failed:", error.response?.data || error.message);
    return {
      code: error.response?.status || 500,
      msg: error.response?.data?.detail || error.response?.data?.msg || "Failed to get all products of current user.",
      data: null as unknown as ProductInteraction[],
    };
  }
};

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
  try {
    console.log(`SERVICE (getProductByBarcodeApi): Fetching product by barcode ${barcode}...`);
    const response = await apiClient.get<ApiResponse<ProductInteraction>>(`/products/product/${barcode}`);
    console.log("SERVICE (getProductByBarcodeApi): API call response:", response);
    return response.data;
  } catch (error: any) {
    console.error("SERVICE (getProductByBarcodeApi): API call failed:", error.response?.data || error.message);
    return {
      code: error.response?.status || 500,
      msg: error.response?.data?.detail || error.response?.data?.msg || "Failed to get product by barcode.",
      data: null as unknown as ProductInteraction,
    };
  }
};

/**
 * Get product by image.
 * Endpoint: POST /products/image
 * @param imgData - The image data to get the product by.
 * @returns The product.
 */
export const getProductByImageApi = async (imgData: CapturedPhoto): Promise<ApiResponse<ProductInteraction>> => {
  console.log(`SERVICE (getProductByImageApi): Getting product by image with payload:`, imgData);
  const payload = {
    base64image: imgData.data
  }
  console.log(imgData.data)
  try {
    const response = await apiClient.post<ApiResponse<ProductInteraction>>(`/products/image`, payload);
    console.log("SERVICE (getProductByImageApi): API call response:", response);
    return response.data;
  } catch (error: any) {
    console.error("SERVICE (getProductByImageApi): API call failed:", error.response?.data || error.message);
    return {
      code: error.response?.status || 500,
      msg: error.response?.data?.detail || error.response?.data?.msg || "Failed to get product by image.",
      data: null as unknown as ProductInteraction,
    };
  }
};

/**
 * Get product health insight.
 * Endpoint: POST /products/health_suggestion
 * @param payload - The payload to get the product health insight.
 * @returns The product health insight.
 */
export const getProductHealthInsightApi = async (payload: { productId: number, base64Image: string }): Promise<ApiResponse<ProductInteraction>> => {
  try {
    console.log(`SERVICE (getProductHealthInsightApi): Getting product health insight with payload:`, payload);
    const response = await apiClient.post<ApiResponse<ProductInteraction>>(`/products/health_suggestion`, payload);
    console.log("SERVICE (getProductHealthInsightApi): API call response:", response);
    return response.data;
  } catch (error: any) {
    console.error("SERVICE (getProductHealthInsightApi): API call failed:", error.response?.data || error.message);
    return {
      code: error.response?.status || 500,
      msg: error.response?.data?.detail || error.response?.data?.msg || "Failed to get product health insight.",
      data: null as unknown as ProductInteraction,
    };
  }
};

/**
 * Fetches a product by its ID.
 * Endpoint: GET /products/{product_id}
 * @param productId - The ID of the product to fetch.
 * @returns The product.
 */
export const getProductByIdApi = async (productId: number): Promise<ProductInteraction> => {
  try {
    console.log(`SERVICE (getProductByIdApi): Fetching product ID ${productId}...`);
    const response = await apiClient.get<ApiResponse<ProductInteraction>>(`/products/${productId}`);
    console.log("SERVICE (getProductByIdApi): API call response:", response.data);

    return response.data.data;
  } catch (error: any) {
    console.error("SERVICE (getProductByIdApi): API call failed:", error.response?.data || error.message);
    return null as unknown as ProductInteraction;
  }
};

/**
 * Deletes a product.
 * Endpoint: DELETE /products/{product_id}
 * @param productId - The ID of the product to delete.
 * @returns The deleted product.
 */
export const deleteProductByIdApi = async (productId: number): Promise<ApiResponse<null>> => {
  console.log(`SERVICE (deleteProductByIdApi): Deleting product ID ${productId}`);
  try {
    const response = await apiClient.delete(`/products/${productId}`);
    return response.data;
  } catch (error: any) {
    console.error("SERVICE (deleteProductByIdApi): API call failed:", error.response?.data || error.message);
    return {
      code: error.response?.status || 500,
      msg: error.response?.data?.detail || error.response?.data?.msg || `Failed to delete product ${productId}.`,
      data: null,
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
  try {
    console.log(`SERVICE (addReviewForProductApi): Adding review for product ID ${productId} with payload:`, payload);
    const response = await apiClient.post<ApiResponse<ProductInteraction>>(`/reviews/products/${productId}`, payload);
    console.log("SERVICE (addReviewForProductApi): API call response:", response);
    return response.data;
  } catch (error: any) {
    console.error("SERVICE (addReviewForProductApi): API call failed:", error.response?.data || error.message);
    return {
      code: error.response?.status || 500,
      msg: error.response?.data?.detail || error.response?.data?.msg || "Failed to add review for product.",
      data: null as unknown as ProductInteraction,
    };
  }
};

/**
 * Updates a review for a product.
 * Endpoint: PATCH /reviews/products/{product_id}
 * @param productId - The ID of the product to update the review for.
 * @param payload - The review data to update.
 * @returns The updated review.
 */
export const updateReviewForProductApi = async (productId: number, payload: ReViewDataPayload): Promise<ApiResponse<ProductInteraction>> => {
  try {
    console.log(`SERVICE (updateReviewForProductApi): Updating review for product ID ${productId} with payload:`, payload);
    const response = await apiClient.patch<ApiResponse<ProductInteraction>>(`/reviews/products/${productId}`, payload);
    console.log("SERVICE (updateReviewForProductApi): API call response:", response);
    return response.data;
  } catch (error: any) {
    console.error("SERVICE (updateReviewForProductApi): API call failed:", error.response?.data || error.message);
    return {
      code: error.response?.status || 500,
      msg: error.response?.data?.detail || error.response?.data?.msg || "Failed to update review for product.",
      data: null as unknown as ProductInteraction,
    };
  }
};

/**
 * Get all product reviews for current users
 * Endpoint: GET /reviews/products @returns all product reviews */
export const getAllProductReviewsApi = async (): Promise<ApiResponse<ProductInteraction[]>> => {
  console.log(`SERVICE (getAllProductReviewsApi): Get all product reviews for current user`);
  const response = await apiClient.get<ApiResponse<ProductInteraction[]>>(`/reviews/products`);
  console.log("SERVICE (getAllProductReviewsApi): API call response:", response);
  return response.data;
};
