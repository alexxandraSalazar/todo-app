// --- Domain Entities ---

/**
 * Base interface for all persistable domain entities.
 * Contains common fields managed by the system/database.
 */
export type Entity = {
    id: string;
    createdAt: string;
};

/**
 * Represents an authenticated user in the system.
 */
export type User = Entity & {
    email: string;
    name: string;
    token: string; // Simulation of a JWT
};

export type TaskStatus = 'pending' | 'completed';

/**
 * Represents a specific task item associated with a user.
 */
export type Task = Entity & {
    title: string;
    description: string;
    status: TaskStatus;
    userId: string; // Foreign Key
};

// --- Data Transfer Objects (DTOs) ---

/**
 * Payload for creating a new task.
 * Only includes fields editable by the user (ID and Date are auto-generated).
 */
export type CreateTaskDTO = Pick<Task, 'title' | 'description'>;

/**
 * Payload for updating a task.
 * Uses `Partial` to allow updating single fields (e.g., just status).
 * Uses `Omit` to prevent modification of immutable fields (id, userId, createdAt).
 */
export type UpdateTaskDTO = Partial<Omit<Task, 'id' | 'userId' | 'createdAt'>>;

export interface LoginCredentials {
    email: string;
    password: string;
}

// --- Utilities ---

/**
 * Standardized API Response Wrapper.
 * Ensures consistent error handling and data parsing across the app.
 */
export type ApiResponse<T> = {
    data: T;
    success: boolean;
    statusCode: number;
    message?: string;
};

/**
 * Computed statistics for the Dashboard.
 */
export type TaskStats = {
    total: number;
    completed: number;
    pending: number;
};

/**
 * Utility type for API Query Parameters (Filtering/Pagination).
 */
export type QueryParams = Record<string, string | number | boolean | undefined>;