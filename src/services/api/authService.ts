import type { User, LoginCredentials, ApiResponse } from '../../types';
import { mockApi } from '../mock/mockApi';

/**
 * Authentication Service Layer.
 * Handles user session initiation and credential exchange.
 */
export const authService = {
    /**
     * Authenticates a user via the backend.
     * 
     * @param {LoginCredentials} credentials - Object containing email and password.
     * @returns {Promise<User>} The user profile and access token upon success.
     * @throws {Error} If authentication fails.
     */
    login: async (credentials: LoginCredentials): Promise<User> => {
        const response: ApiResponse<User> = await mockApi.login(credentials.email, credentials.password);
        return response.data;
    },
};