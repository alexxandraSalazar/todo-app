import { makeAutoObservable, runInAction } from "mobx";
import type { User, LoginCredentials } from "../types";
import { authService } from "../services/api/authService";

/**
 * Authentication Store.
 * Manages user session state, login/logout actions, and LocalStorage persistence.
 * 
 * Implements the Singleton pattern to ensure a single source of truth for auth status.
 */
class AuthStore {
    user: User | null = null;
    isAuthenticated: boolean = false;
    isLoading: boolean = false;
    error: string | null = null;

    constructor() {
        makeAutoObservable(this);
        // Hydrate state immediately upon initialization
        this.checkAuth();
    }

    /**
     * Hydrates the store state from LocalStorage on app launch.
     * This prevents the user from being logged out on page reload.
     * @private
     */
    private checkAuth() {
        const storedUser = localStorage.getItem('auth_user');
        if (storedUser) {
            try {
                this.user = JSON.parse(storedUser);
                this.isAuthenticated = true;
            } catch (e: unknown) {
                console.error("Error parsing auth user", e);
                this.logout(); // Fail-safe: clear corrupted data
            }
        }
    }

    /**
     * Authenticates the user against the API.
     * On success, updates the observable state and persists the session.
     * 
     * @param {LoginCredentials} credentials - Email and password.
     * @returns {Promise<void>}
     */
    login = async (credentials: LoginCredentials): Promise<void> => {
        this.isLoading = true;
        this.error = null;
        try {
            const userData = await authService.login(credentials);

            // 'runInAction' is required when modifying state after an await in strict mode
            runInAction(() => {
                this.user = userData;
                this.isAuthenticated = true;
                localStorage.setItem('auth_user', JSON.stringify(userData));
            });
        } catch (err: unknown) {
            runInAction(() => {
                if (err instanceof Error) {
                    this.error = err.message;
                } else {
                    this.error = "Error desconocido al iniciar sesión";
                }
            });
        } finally {
            runInAction(() => this.isLoading = false);
        }
    };

    /**
     * Clears the user session from memory and local storage.
     */
    logout = (): void => {
        this.user = null;
        this.isAuthenticated = false;
        this.error = null;
        localStorage.removeItem('auth_user');
    };
}

export const authStore = new AuthStore();