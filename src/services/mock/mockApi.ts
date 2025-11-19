import { v4 as uuidv4 } from 'uuid';
import type { ApiResponse, QueryParams, Entity, User } from '../../types';

// Leemos la variable de entorno o usamos 400 por defecto
const DELAY_MS = Number(import.meta.env.VITE_MOCK_DELAY) || 400;

/**
 * Simulates network latency to mimic real-world API delays.
 * @param {number} ms - Milliseconds to delay execution.
 * @returns {Promise<void>}
 */
const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * A generic wrapper around LocalStorage to simulate a Database Table.
 * @template T - The entity type extending the base Entity interface.
 */
class LocalDB<T extends Entity> {
    // CORRECCIÓN: Declaración explícita para evitar error TS1294
    private key: string;

    constructor(key: string) { 
        this.key = key;
    }

    /**
     * Retrieves all records from the simulated storage.
     */
    getAll(): T[] {
        const data = localStorage.getItem(this.key);
        return data ? JSON.parse(data) : [];
    }

    /**
     * Persists the entire dataset to LocalStorage.
     * @param {T[]} data - The array of entities to save.
     */
    save(data: T[]): void {
        localStorage.setItem(this.key, JSON.stringify(data));
    }
}

/**
 * Helper to wrap raw data into a standardized API response format.
 */
const successResponse = <T>(data: T, code = 200): ApiResponse<T> => ({
    data,
    success: true,
    statusCode: code,
});

/**
 * Mock API Engine.
 * Intercepts HTTP-like requests and executes them against a LocalStorage "database"
 * with artificial latency.
 */
export const mockApi = {
    /**
     * Simulates user authentication.
     * Validates credentials against hardcoded demo values.
     * 
     * @param {string} email - User email.
     * @param {string} [password] - User password.
     * @returns {Promise<ApiResponse<User>>} Authenticated user details and token.
     * @throws {Error} If credentials do not match 'demo@gmail.com' / '123456'.
     */
    login: async (email: string, password?: string): Promise<ApiResponse<User>> => {
        await wait(DELAY_MS);

        if (email === 'demo@gmail.com' && password === '123456') {
            const user: User = {
                id: 'u-1',
                name: 'Usuario Demo',
                email,
                token: 'mock-jwt-token-123',
                createdAt: new Date().toISOString()
            };
            return successResponse(user);
        }

        throw new Error("Credenciales incorrectas (Usa: demo@gmail.com / 123456)");
    },

    /**
     * Generic GET handler.
     * Fetches resources and applies basic filtering based on query params.
     * 
     * @template T - The expected return type.
     * @param {string} endpoint - Resource endpoint (e.g., '/tasks').
     * @param {QueryParams} [params] - Key-value pairs for filtering results.
     * @returns {Promise<ApiResponse<T[]>>} List of matching entities.
     */
    get: async <T extends Entity>(endpoint: string, params?: QueryParams): Promise<ApiResponse<T[]>> => {
        await wait(DELAY_MS);

        if (endpoint === '/tasks') {
            const db = new LocalDB<T>('db_tasks');
            let items = db.getAll();

            // Basic filtering simulation (e.g., by userId)
            if (params?.userId) {
                items = items.filter(item => (item as unknown as { userId: string }).userId === String(params.userId));
            }

            return successResponse(items);
        }
        throw new Error(`Endpoint ${endpoint} not found (GET)`);
    },

    /**
     * Generic POST handler.
     * Creates a new resource, auto-generating ID and timestamps.
     * 
     * @template T - The entity type.
     * @param {string} endpoint - Resource endpoint.
     * @param {unknown} body - The payload DTO (Data Transfer Object).
     * @returns {Promise<ApiResponse<T>>} The newly created entity.
     */
    post: async <T extends Entity>(endpoint: string, body: unknown): Promise<ApiResponse<T>> => {
        await wait(DELAY_MS);

        if (endpoint === '/tasks') {
            const db = new LocalDB<T>('db_tasks');
            const payload = body as Omit<T, keyof Entity>;

            const newItem = {
                ...payload,
                id: uuidv4(),
                createdAt: new Date().toISOString()
            } as T;

            const items = db.getAll();
            db.save([...items, newItem]);

            return successResponse(newItem, 201);
        }
        throw new Error(`Endpoint ${endpoint} not found (POST)`);
    },

    /**
     * Generic DELETE handler.
     * Removes a resource by ID parsed from the endpoint URL.
     * 
     * @param {string} endpoint - Resource URL containing the ID (e.g., '/tasks/123').
     * @returns {Promise<ApiResponse<void>>}
     */
    delete: async (endpoint: string): Promise<ApiResponse<void>> => {
        await wait(DELAY_MS);

        if (endpoint.startsWith('/tasks/')) {
            const id = endpoint.split('/').pop();
            if (!id) throw new Error("ID inválido");

            const db = new LocalDB<Entity>('db_tasks');
            const items = db.getAll().filter(i => i.id !== id);
            db.save(items);

            return successResponse(undefined as unknown as void);
        }
        throw new Error(`Endpoint ${endpoint} not found (DELETE)`);
    },

    /**
     * Generic PUT handler.
     * Updates an existing resource by ID.
     * 
     * @template T - The entity type.
     * @param {string} endpoint - Resource URL containing the ID.
     * @param {unknown} body - Partial data to update.
     * @returns {Promise<ApiResponse<T>>} The updated entity.
     */
    put: async <T extends Entity>(endpoint: string, body: unknown): Promise<ApiResponse<T>> => {
        await wait(DELAY_MS);

        if (endpoint.startsWith('/tasks/')) {
            const id = endpoint.split('/').pop();
            if (!id) throw new Error("ID inválido");

            const db = new LocalDB<T>('db_tasks');
            const items = db.getAll();
            const index = items.findIndex(i => i.id === id);

            if (index === -1) throw new Error("Elemento no encontrado");

            const updates = body as Partial<T>;
            const updatedItem = { ...items[index], ...updates };

            items[index] = updatedItem;
            db.save(items);

            return successResponse(updatedItem);
        }
        throw new Error(`Endpoint ${endpoint} not found (PUT)`);
    },
};