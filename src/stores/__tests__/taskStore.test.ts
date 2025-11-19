import { taskStore } from '@/stores/taskStore';
import { taskService } from '@/services/api/taskService';
import { runInAction } from 'mobx';

jest.mock('@/services/api/taskService');

describe('TaskStore Logic', () => {
    beforeEach(() => {
        runInAction(() => {
            taskStore.tasks = [];
        });
    });

    test('AddTask: Agrega tarea al estado', async () => {
        const newTask = {
            id: '100', title: 'New Task', description: '', status: 'pending' as const, userId: 'u1', createdAt: ''
        };

        (taskService.create as jest.Mock).mockResolvedValue(newTask);

        await taskStore.addTask({ title: 'New Task', description: '' }, 'u1');

        expect(taskStore.tasks).toHaveLength(1);
        expect(taskStore.tasks[0].title).toBe('New Task');
    });

    test('Stats: Calcula correctamente', () => {
        runInAction(() => {
            taskStore.tasks = [
                { id: '1', title: 'A', description: '', status: 'completed', userId: '1', createdAt: '' },
                { id: '2', title: 'B', description: '', status: 'pending', userId: '1', createdAt: '' },
            ];
        });

        expect(taskStore.stats.total).toBe(2);
        expect(taskStore.stats.completed).toBe(1);
        expect(taskStore.stats.pending).toBe(1);
    });
});