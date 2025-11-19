import { useStore } from "../stores/rootStore";

/**
 * Authentication Facade Hook.
 * Abstracts the MobX `authStore` to provide a simplified interface for UI components.
 * 
 * It exposes reactive state (user, loading, errors) and actions (login, logout).
 * Using this hook prevents components from accessing the store implementation directly.
 * 
 * @returns {Object} Auth state and control methods.
 */
export const useAuth = () => {
    const { authStore } = useStore();

    return {
        user: authStore.user,
        isAuthenticated: authStore.isAuthenticated,
        isLoading: authStore.isLoading,
        error: authStore.error,
        
        // Actions
        login: authStore.login,
        logout: authStore.logout
    };
};