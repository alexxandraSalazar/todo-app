import type { Task, CreateTaskDTO, UpdateTaskDTO, ApiResponse } from '../../types';
import { mockApi } from '../mock/mockApi';

/**
 * Task Service Layer.
 * Acts as an adapter between the application logic (Stores) and the Data Source (MockAPI).
 * This abstraction allows replacing the mock with a real Axios client without changing the UI logic.
 */
export const taskService = {
    /**
     * Retrieves all tasks associated with a specific user.
     * @param {string} userId - The ID of the authenticated user.
     * @returns {Promise<Task[]>} List of tasks.
     */
    getAll: async (userId: string): Promise<Task[]> => {
        const response: ApiResponse<Task[]> = await mockApi.get<Task>('/tasks', { userId });
        return response.data;
    },

    /**
     * Creates a new task.
     * Automatically sets the initial status to 'pending'.
     * 
     * @param {CreateTaskDTO} dto - Data Transfer Object containing title and description.
     * @param {string} userId - The owner of the task.
     * @returns {Promise<Task>} The created task with ID and timestamp.
     */
    create: async (dto: CreateTaskDTO, userId: string): Promise<Task> => {
        const payload = { ...dto, userId, status: 'pending' }; 
        const response: ApiResponse<Task> = await mockApi.post<Task>('/tasks', payload);
        return response.data;
    },

    /**
     * Updates an existing task.
     * Supports partial updates (e.g., only changing status or title).
     * 
     * @param {string} id - The unique ID of the task.
     * @param {UpdateTaskDTO} changes - The fields to update.
     * @returns {Promise<Task>} The updated task.
     */
    update: async (id: string, changes: UpdateTaskDTO): Promise<Task> => {
        const response: ApiResponse<Task> = await mockApi.put<Task>(`/tasks/${id}`, changes);
        return response.data;
    },

    /**
     * Deletes a task permanently.
     * @param {string} taskId - The unique ID of the task to remove.
     * @returns {Promise<void>}
     */
    delete: async (taskId: string): Promise<void> => {
        await mockApi.delete(`/tasks/${taskId}`);
    }
};