// src/types/index.ts

/**
 * Represents a user object, aligning with the backend schema.
 */
export interface User {
  id: number;
  name: string;
  email: string;
  health_flags: string[];
  badges: ApiBadge[];
  created_at?: string; // Optional, from GET response
  updated_at?: string; // Optional, from GET response
}

/**
 * Payload for creating a new user (matches backend's UserCreate schema).
 */
export interface UserCreatePayload {
  name: string;
  email: string;
  health_flags: string[];
  badges: ApiBadge[];
  password: string;
}

/**
 * Payload for updating an existing user (matches backend's UserUpdate schema).
 * Note: Fields are optional to allow partial updates.
 */
export interface UserUpdatePayload {
  name?: string;
  health_flags?: string[];
  badges?: ApiBadge[];
  password?: string;
}

/**
 * Credentials for user login.
 */
export interface LoginCredentials {
    username: string; // FastAPI's OAuth2PasswordRequestForm expects 'username' (which will be our email)
    password: string;
}

/**
 * Expected response data from the /auth/token endpoint.
 */
export interface TokenResponse {
    access_token: string;
    token_type: string;
}

/**
 * Generic API response structure from backend.
 */
export interface ApiResponse<T = any> {
    access_token?: string | null;
    token_type?: string;
    code: number;
    data?: T;
    msg: string;
    detail?: any;
}

/**
 * Interface for badge data as it might come from an API or database.
 */
export interface ApiBadge {
  id: string;
  dateEarned: string | null;
}

/**
 * Interface for mapping other badge data apart from API badge data
 */
export interface BadgeMapping {
  id: string
  name: string
  description: string
  imageUrl: string
  isUnlockable: (value: BadgeStatistic) => boolean
}

/**
 * Interface for badge data specific to user for frontend display
 */
export interface DisplayBadge extends BadgeMapping, ApiBadge {}

/**
 * Interface for value to pass into badge checking logic
 */
export interface BadgeStatistic {
  totalReviewCount: number
}

/**
 * Defines the possible AI health conclusions for a scanned product.
 */
export type AiHealthConclusion = 'good' | 'caution' | 'avoid' | 'neutral' | 'info_needed' | 'error_analyzing';

/**
 * Defines the possible fetch statuses for a scanned product.
 */
export type FetchStatus = 'found' | 'not_found_in_db' | 'api_error';

/**
 * Represents a user's interaction with a product.
 * This can be a scan, a review, or both.
 */
export interface Product {
  id?: number;                    // Unique identifier (barcode from OFF will be used as ID)
  barcode?: string;              // The scanned barcode
  name?: string;                  // Product name
  brands?: string;               // Product brands (as a string from OFF)
  imageUrl?: string;             // Main product image
  imageIngredientsUrl?: string;  // Ingredients image URL
  imageNutritionUrl?: string;    // Nutrition image URL
  categories?: string;           // Categories (as a string from OFF)

  // AI-generated insights (will be populated by scanStore after this fetch)
  aiHealthSummary?: string;
  aiHealthConclusion?: AiHealthConclusion; 
  
  // User Review Details (will be populated by historyStore if user has reviewed this product)
  isReviewed?: boolean;           // Default to false when fetching from OFF
  userRating?: number;
  userNotes?: string;
  dateReviewed?: string;         // Date of user's review
  dateScanned?: string;           // Date this item was processed by the app
  likeCount?: number;            // Likes on a user's review (not directly from OFF product data)

  fetchStatus?: FetchStatus;      // Status of the OFF fetch
}

/**
 * Payload for creating a new product (POST /products/).
 * Matches backend's schemas.ProductCreate.
 */
export interface ProductCreatePayload {
  name: string;
  image_url?: string;
  barcode?: string;
  generic_name?: string;
  ingredients?: string; 
  categories?: string;  
  brands?: string;      
}

/**
* Payload for updating an existing product (PATCH /products/{product_id}).
*/
export interface ProductUpdatePayload {
  name?: string;
  image_url?: string;
  barcode?: string;
  generic_name?: string;
  ingredients?: string;
  categories?: string;
  brands?: string;
  ai_health_summary?: string; // If backend supports updating these
  ai_health_conclusion?: AiHealthConclusion;
}

// --- Interfaces mirroring Backend Pydantic Schemas for mapping ---
// From your backend: schemas.ProductDetails
interface BackendProductDetailsData {
  id: number;
  name: string;
  brands?: string | null;
  barcode?: string | null;
  image_url?: string | null;
  categories?: string | null;
  isReviewed: boolean;
  user_rating?: number | null;
  user_note?: string | null; 
  ai_health_summary?: string | null;
  ai_health_conclusion?: string | null; 
  data_scanned_at?: string | null; 
  data_reviewed?: string | null;   
}
// From your backend: schemas.ProductDetailsFrontendOut
interface BackendProductDetailsWrapper { // Renamed to avoid conflict
  product: BackendProductDetailsData;
}
// From your backend: schemas.ProductOut
interface BackendBasicProductData { 
  id: number;
  name: string;
  generic_name?: string | null;
  ingredients?: string | null;
  // Note: image_url, barcode, categories, brands are NOT in your backend ProductOut
  // This means creating/updating a product will return minimal info.
  // The frontend might need to re-fetch full details using getProductByIdApi after create/update.
}

export interface PublicReviewItem {
  reviewId: string;          // Unique ID for this public review entry
  productId: string;         // ID of the product being reviewed
  productName: string;
  productImageUrl?: string;

  reviewerId: string;        // ID of the user who wrote the review
  reviewerUsername: string;
  reviewerAvatarUrl?: string; // Optional

  userRating: number;        // The rating given by this reviewer
  userNotes: string;         // The review notes from this reviewer
  dateReviewed: string;      // ISO date string

  likeCount: number;
  // Potentially other fields like comments count, etc.
}

export interface PointConversionGift {
  id: string;                // Unique identifier for the gift
  name: string;              // Name of the gift
  requiredPoints: number;    // Points required to redeem the gift
  icon: "coin" | "drink" | "shopping-cart" // Define icon
}