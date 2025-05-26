// frontend/src/services/authService.ts
import apiClient from './apiClient';
import type { 
    User, 
    UserCreatePayload, 
    UserUpdatePayload, // Keep if plan to use it
    LoginCredentials, 
    TokenResponse,      // For the token endpoint response
    ApiResponse 
} from '../types';

/**
 * Registers a new user by calling the backend API.
 * @param userData - The user data for registration.
 * @returns A Promise resolving to the backend's ApiResponse containing the created user.
 */
export const registerUserApi = async (userData: UserCreatePayload): Promise<ApiResponse<User>> => {
  // The backend expects health_flags and badges as simple string arrays for creation now
  const payload = {
      ...userData,
      health_flags: userData.health_flags, // Already strings
      badges: userData.badges,             // Already strings
  };
  const response = await apiClient.post<ApiResponse<User>>('/users/', payload); // Note trailing slash if FastAPI router has it
  return response.data;
};

/**
 * Logs in an existing user by calling the backend /auth/token endpoint.
 * @param credentials - Email (as username) and password.
 * @returns A Promise resolving to the backend's ApiResponse containing the access token.
 */
export const loginUserApi = async (credentials: LoginCredentials): Promise<ApiResponse<TokenResponse>> => {
  // FastAPI's OAuth2PasswordRequestForm expects form data
  const formData = new URLSearchParams();
  formData.append('username', credentials.username); // 'username' is the field FastAPI expects for email
  formData.append('password', credentials.password);

  const response = await apiClient.post<ApiResponse<TokenResponse>>('/auth/token', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return response.data;
};

/**
 * Fetches the current authenticated user's data (e.g., from a /users/me endpoint).
 * @returns A Promise resolving to the backend's ApiResponse containing the user data.
 */
export const fetchCurrentUserApi = async (): Promise<ApiResponse<User>> => {
    // This assumes have a '/users/me' endpoint protected by token authentication
    const response = await apiClient.get<ApiResponse<User>>('/users/me');
    return response.data;
};


/**
 * Updates user data by ID.
 * @param userId - The ID of the user to update.
 * @param userData - The user data to update.
 * @returns A Promise resolving to the updated user data.
 */
export const updateUserApi = async (userId: number, userData: UserUpdatePayload): Promise<ApiResponse<User>> => {
  // Ensure health_flags and badges are arrays of strings if that's what the backend PATCH expects
  const payload = {
      ...userData,
      health_flags: userData.health_flags,
      badges: userData.badges,
  };
  const response = await apiClient.patch<ApiResponse<User>>(`/users/${userId}`, payload);
  return response.data;
};