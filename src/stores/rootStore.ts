import { createContext, useContext } from "react";
import { authStore } from "./authStore";
import { taskStore } from "./taskStore";

interface IRootStore {
    authStore: typeof authStore;
    taskStore: typeof taskStore;
}

/**
 * Root Store Aggregator.
 * Groups all domain stores into a single object to be provided via React Context.
 * This facilitates dependency injection and simplifies imports in components.
 */
export const rootStore: IRootStore = {
    authStore,
    taskStore
};

// Context creation
const StoreContext = createContext<IRootStore>(rootStore);

/**
 * Custom Hook to access the Root Store.
 * Acts as a Facade to prevent direct Context usage in components.
 * 
 * @returns {IRootStore} The object containing all application stores.
 * @throws {Error} If used outside of StoreContext.Provider (though we use a default value here).
 */
export const useStore = () => {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error("useStore debe ser usado dentro de un StoreContext.Provider");
    }
    return context;
};