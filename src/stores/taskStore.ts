import { makeAutoObservable, runInAction } from "mobx";
import type { Task, CreateTaskDTO, TaskStats, UpdateTaskDTO } from "../types";
import { taskService } from "../services/api/taskService";

/**
 * Task Management Store.
 * Handles CRUD operations for tasks using Optimistic UI updates for better performance.
 */
class TaskStore {
    tasks: Task[] = [];
    isLoading = false;
    error: string | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    /**
     * Computed Property: Derived statistics from the current tasks list.
     * MobX caches this value and only re-calculates when 'tasks' changes.
     * 
     * @returns {TaskStats} Object containing total, completed, and pending counts.
     */
    get stats(): TaskStats {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.status === 'completed').length;
        return {
            total,
            completed,
            pending: total - completed
        };
    }

    /**
     * Fetches all tasks for a specific user from the API.
     * @param {string} userId - The authenticated user ID.
     */
    fetchTasks = async (userId: string): Promise<void> => {
        this.isLoading = true;
        this.error = null;
        try {
            const data = await taskService.getAll(userId);
            runInAction(() => {
                this.tasks = data;
            });
        } catch (err: unknown) {
            runInAction(() => {
                if (err instanceof Error) {
                    this.error = err.message;
                } else {
                    this.error = "Error desconocido al cargar tareas";
                }
            });
        } finally {
            runInAction(() => this.isLoading = false);
        }
    };

    /**
     * Creates a new task and appends it to the list.
     * @param {CreateTaskDTO} dto - Task title and description.
     * @param {string} userId - Owner ID.
     */
    addTask = async (dto: CreateTaskDTO, userId: string): Promise<void> => {
        this.isLoading = true;
        try {
            const newTask = await taskService.create(dto, userId);
            runInAction(() => this.tasks.push(newTask));
        } catch (err: unknown) {
            runInAction(() => this.error = "No se pudo crear la tarea");
        } finally {
            runInAction(() => this.isLoading = false);
        }
    };

    /**
     * Updates a task using Optimistic UI pattern.
     * 1. Updates the UI immediately.
     * 2. Sends the request to the server.
     * 3. Reverts changes (Rollback) if the server request fails.
     * 
     * @param {string} id - Task ID.
     * @param {UpdateTaskDTO} changes - Partial fields to update.
     */
    updateTask = async (id: string, changes: UpdateTaskDTO): Promise<void> => {
        // 1. Create backup for rollback capability
        const originalTasks = [...this.tasks];

        // 2. Optimistic Update
        const taskIndex = this.tasks.findIndex(t => t.id === id);
        if (taskIndex > -1) {
            this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...changes };
        }

        try {
            // 3. API Sync
            await taskService.update(id, changes);
        } catch (err: unknown) {
            // 4. Rollback on failure
            runInAction(() => {
                this.tasks = originalTasks;
                this.error = "Error al actualizar la tarea";
            });
        }
    };

    /**
     * Deletes a task using Optimistic UI pattern.
     * Removes the item immediately from the UI and restores it if the API fails.
     * 
     * @param {string} id - Task ID to remove.
     */
    removeTask = async (id: string): Promise<void> => {
        const backup = [...this.tasks];
        this.tasks = this.tasks.filter(t => t.id !== id);

        try {
            await taskService.delete(id);
        } catch (err: unknown) {
            runInAction(() => {
                this.tasks = backup;
                this.error = "Error al eliminar, cambios revertidos";
            });
        }
    };
}

export const taskStore = new TaskStore();