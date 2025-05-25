// frontend/src/services/authService.ts
import apiClient from './apiClient';
import type { 
    User, 
    UserCreatePayload,
    UserUpdatePayload,
    LoginCredentials, 
    TokenResponse, 
    ApiResponse 
} from '../types';

// --- Temporary localStorage Persistence Logic ---
// TODO: Remove this block when backend is live and localStorage is not needed
const USERS_STORAGE_KEY = 'flavorpal_users';    
const TOKEN_STORAGE_KEY = 'flavorpal_auth_token'; 
const CURRENT_USER_STORAGE_KEY = 'flavorpal_current_user'; 
const USER_ID_COUNTER_KEY = 'flavorpal_user_id_counter';

interface StoredUserForDummyDb extends User {
    _dummyHashedPassword?: string; 
}

const getStoredUsers = (): StoredUserForDummyDb[] => {
  const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
  try { return usersJson ? JSON.parse(usersJson) : []; } catch (e) { return []; }
};

const saveStoredUsers = (users: StoredUserForDummyDb[]) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

const getNextUserId = (): number => {
  let counter = parseInt(localStorage.getItem(USER_ID_COUNTER_KEY) || '0', 10);
  counter++;
  localStorage.setItem(USER_ID_COUNTER_KEY, counter.toString());
  return counter;
};

const dummyHashPassword = (password: string): string => `dummyhashed_${password}_flavorpal_v5`;
const dummyVerifyPassword = (plainPassword: string, storedHashedPassword?: string): boolean => {
  if (!storedHashedPassword) return false;
  return storedHashedPassword === dummyHashPassword(plainPassword);
};
// --- End of Temporary localStorage Persistence Logic ---


/**
 * Registers a new user by calling the backend API.
 * @param userData - The user data for registration.
 * @returns A Promise resolving to the backend's ApiResponse containing the created user.
 */
export const registerUserApi = async (userData: UserCreatePayload): Promise<ApiResponse<User>> => {
  // TODO: Uncomment this block when backend is ready
  // const payload = {
  //     username: userData.username,
  //     email: userData.email,
  //     password: userData.password,
  //     health_flags: userData.health_flags,
  // };
  // const response = await apiClient.post<ApiResponse<User>>('/users/', payload);

  // return response.data;

  // --- TEMPORARY DUMMY RESPONSE LOGIC (Delete this block when backend is ready) ---
  // TODO: Remove this block when backend is live and localStorage is not needed
  console.log("Registering user (dummy logic):", userData);
  await new Promise(resolve => setTimeout(resolve, 300)); 
  let users = getStoredUsers();
  if (users.find(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
    const errorResponse: ApiResponse<User> = { code: 400, data: {} as User, msg: "Email already registered." };
    return errorResponse; 
  }

  const newUserForStorage: StoredUserForDummyDb = {
    id: getNextUserId(), 
    username: userData.username, // Store the display username
    email: userData.email,
    health_flags: userData.health_flags,
    badges: [], 
    _dummyHashedPassword: dummyHashPassword(userData.password) 
  };
  users.push(newUserForStorage);
  saveStoredUsers(users);

  const { _dummyHashedPassword, ...userToReturn } = newUserForStorage; 
  const successResponse: ApiResponse<User> = {
    code: 201, 
    data: userToReturn,
    msg: "User created successfully. Please login."
  };
  console.log("SERVICE (registerUserApi): Returning success:", successResponse);
  return successResponse;
  // --- END OF TEMPORARY DUMMY RESPONSE LOGIC ---
};

/**
 * Logs in an existing user by calling the backend /auth/token endpoint.
 * @param credentials - Email (as username) and password.
 * @returns A Promise resolving to the backend's ApiResponse containing the access token.
 */
export const loginUserApi = async (credentials: LoginCredentials): Promise<ApiResponse<TokenResponse>> => {
  // FastAPI's OAuth2PasswordRequestForm expects form data
  // TODO: Uncomment this block when backend is ready
  // const formData = new URLSearchParams();
  // formData.append('username', credentials.username); // 'username' is the field FastAPI expects for email
  // formData.append('password', credentials.password);

  // const response = await apiClient.post<ApiResponse<TokenResponse>>('/auth/token', formData, {
  //   headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  // });
  // return response.data;

  // --- TEMPORARY DUMMY RESPONSE LOGIC (Delete this block when backend is ready) ---
  // TODO: Remove this block when backend is live and localStorage is not needed
  await new Promise(resolve => setTimeout(resolve, 300));
  const users = getStoredUsers();
  const foundUserInternal = users.find(u => u.email.toLowerCase() === credentials.username.toLowerCase());

  if (foundUserInternal && dummyVerifyPassword(credentials.password, foundUserInternal._dummyHashedPassword)) {
    const dummyToken = `dummy_jwt_for_${foundUserInternal.email}_${Date.now()}`;
    const { _dummyHashedPassword, ...userToStoreForSession } = foundUserInternal;
    
    localStorage.setItem(TOKEN_STORAGE_KEY, dummyToken);
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(userToStoreForSession));

    const successResponse: ApiResponse<TokenResponse> = {
      code: 200,
      data: { access_token: dummyToken, token_type: "bearer" },
      msg: "Login successful."
    };
    return successResponse;
  }

  const errorResponse: ApiResponse<TokenResponse> = {
    code: 401, 
    data: {} as TokenResponse,
    msg: "Incorrect email or password.",
  };
  return errorResponse;
  // --- END OF TEMPORARY DUMMY RESPONSE LOGIC ---
};

/**
 * Fetches the current authenticated user's data.
 * @returns A Promise resolving to the backend's ApiResponse containing the user data.
 */
export const fetchCurrentUserApi = async (): Promise<ApiResponse<User>> => {
    // TODO: Uncomment this block when backend is ready
    // const response = await apiClient.get<ApiResponse<User>>('/users/me');
    // return response.data;

    // --- TEMPORARY DUMMY RESPONSE LOGIC (Delete this block when backend is ready) ---
    // TODO: Remove this block when backend is live and localStorage is not needed
    await new Promise(resolve => setTimeout(resolve, 100));
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    const userJson = localStorage.getItem(CURRENT_USER_STORAGE_KEY);

    if (token && userJson) {
      try {
        const user = JSON.parse(userJson) as User;
        if (token.startsWith("dummy_jwt_for_") && token.includes(user.email)) { // Simple token check
          const successResponse: ApiResponse<User> = {
              code: 200, data: user, msg: "Current user data fetched successfully."
          };
          return successResponse;
        }
      } catch(e) { console.error("Error parsing current user from localStorage:", e); }
    }
    
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    const errorResponse: ApiResponse<User> = {
      code: 401, data: {} as User, msg: "Not authenticated or session invalid."
    };
    return errorResponse;
    // --- END OF TEMPORARY DUMMY RESPONSE LOGIC ---
};


/**
 * Updates user data by ID.
 * @param userId - The ID of the user to update.
 * @param userData - The user data to update.
 * @returns A Promise resolving to the updated user data.
 */
export const updateUserApi = async (userId: number, userData: UserUpdatePayload): Promise<ApiResponse<User>> => {
  // TODO: Uncomment this block when backend is ready
  // const payload = {
  //     ...userData,
  //     health_flags: userData.health_flags,
  //     badges: userData.badges,
  // };
  // const response = await apiClient.patch<ApiResponse<User>>(`/users/${userId}`, payload);
  // return response.data;

  // --- TEMPORARY DUMMY RESPONSE LOGIC (Delete this block when backend is ready) ---
  // TODO: Remove this block when backend is live and localStorage is not needed
  await new Promise(resolve => setTimeout(resolve, 300));
  let users = getStoredUsers();
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex !== -1) {
    // Apply updates from payload
    if (userData.username !== undefined) {
      users[userIndex].username = userData.username; // Update 'name' field for username
    }
    if (userData.health_flags !== undefined) {
      users[userIndex].health_flags = userData.health_flags;
    }
    if (userData.badges !== undefined) { // If badges can be updated this way
      users[userIndex].badges = userData.badges;
    }
    // Note: Password updates should typically be a separate, more secure endpoint.

    saveStoredUsers(users);
    
    const { _dummyHashedPassword, ...userToReturn } = users[userIndex];
    if (localStorage.getItem(CURRENT_USER_STORAGE_KEY)) {
        const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_STORAGE_KEY)!) as User;
        if (currentUser.id === userId) {
            localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(userToReturn));
        }
    }
    const successResponse: ApiResponse<User> = {
      code: 200,
      data: userToReturn,
      msg: "User updated successfully."
    };
    console.log("SERVICE (updateUserApi): Returning success:", successResponse);
    return successResponse;
  }
  const errorResponse: ApiResponse<User> = {
    code: 404, // Not Found
    data: {} as User,
    msg: "User not found for update."
  };
  console.log("SERVICE (updateUserApi): Returning error:", errorResponse);
  return errorResponse;
  // --- END OF TEMPORARY DUMMY RESPONSE LOGIC ---
};