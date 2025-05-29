// frontend/src/services/authService.ts
import apiClient from './apiClient';
import type {
    User,
    UserCreatePayload,
    UserUpdatePayload,
    LoginCredentials,
    TokenResponse,
    ApiResponse,
    ScanStatistics
} from '../types';

/**
 * Registers a new user by calling the backend API.
 * @param userData - The user data for registration.
 * @returns A Promise resolving to the backend's ApiResponse containing the created user.
 */
export const registerUserApi = async (userData: UserCreatePayload): Promise<ApiResponse<User>> => {
  const payload = {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      healthFlags: userData.healthFlags,
  };
  const response = await apiClient.post<ApiResponse<User>>('/users/', payload);

  return response.data;
};

/**
 * Logs in an existing user by calling the backend /auth/token endpoint.
 * @param credentials - Email (as username) and password.
 * @returns A Promise resolving to the backend's ApiResponse containing the access token.
 */
export const loginUserApi = async (credentials: LoginCredentials): Promise<ApiResponse<TokenResponse>> => {
  try {
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await apiClient.post<ApiResponse<TokenResponse>>('/auth/token', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("AuthStore: Login user error:", error);
    return {
      code: 401,
      msg: "Username or password is incorrect",
      data: null as unknown as TokenResponse,
    };
  }
};

/**
 * Fetches the current authenticated user's data.
 * @returns A Promise resolving to the backend's ApiResponse containing the user data.
 */
export const fetchCurrentUserApi = async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get<ApiResponse<User>>('/users/auth/me');
    console.log("AuthStore: Fetch current user response:", response);
    return response.data;
};


/**
 * Updates user data by ID.
 * @param userId - The ID of the user to update.
 * @param payload - The user data to update.
 * @returns A Promise resolving to the updated user data.
 */
export const updateUserApi = async (userId: number, payload: UserUpdatePayload): Promise<ApiResponse<User>> => {
  console.log("SERVICE (updateUserApi): Updating user ID", userId, "with payload:", payload);
  const response = await apiClient.patch<ApiResponse<User>>(`/users/${userId}`, payload);
  console.log("AuthStore: Update user response:", response);
  return response.data;
};

/**
 * Logs out the user by calling the backend endpoint.
 * @returns A Promise resolving to an ApiResponse.
 */
export const logoutUserApi = async (): Promise<ApiResponse<null>> => {
  const response = await apiClient.post<ApiResponse<null>>('/users/auth/logout'); 
  return response.data;
};

/**
 * Get scan statistics
 * Endpoint: GET /users/scan_statistics
 * @returns The scan statistics.
 */
export const getScanStatisticsApi = async (): Promise<ApiResponse<ScanStatistics>> => {
  console.log("AuthStore: Get scan statistics");
  const response = await apiClient.get<ApiResponse<ScanStatistics>>('/users/scan_statistics');
  console.log("AuthStore: Get scan statistics response:", response);
  return response.data;
};