import { useEffect } from 'react';
import { useStore } from '../stores/rootStore';
import type { UpdateTaskDTO } from '../types/index';

/**
 * Tasks Facade Hook.
 * Manages the lifecycle of task data fetching and manipulation.
 * 
 * Features:
 * 1. **Auto-Fetch:** Automatically loads tasks when the component mounts or the user changes.
 * 2. **Context Injection:** Automatically injects the current `userId` into actions, keeping the UI code clean.
 * 3. **State Exposure:** Provides access to tasks list, loading state, and computed statistics.
 */
export const useTasks = () => {
  const { taskStore, authStore } = useStore(); 
  const userId = authStore.user?.id;

  /**
   * Side Effect: Data Synchronization.
   * Fetches tasks only if a user is logged in and the store is empty.
   * This prevents unnecessary API calls on re-renders.
   */
  useEffect(() => {
    if (userId && taskStore.tasks.length === 0) {
      taskStore.fetchTasks(userId);
    }
  }, [userId, taskStore]); 

  return {
    // Reactive State
    tasks: taskStore.tasks,
    isLoading: taskStore.isLoading,
    error: taskStore.error, 
    stats: taskStore.stats, 
    
    // Actions (Wrappers with Dependency Injection)
    
    /**
     * Creates a new task for the current user.
     * @param title - Task title.
     * @param description - Task description.
     */
    addTask: (title: string, description: string) => 
      userId && taskStore.addTask({ title, description }, userId),
  
    /**
     * Updates an existing task (Optimistic Update).
     */
    updateTask: (id: string, changes: UpdateTaskDTO) => 
      taskStore.updateTask(id, changes),
      
    /**
     * Removes a task (Optimistic Delete).
     */
    deleteTask: taskStore.removeTask
  };
};