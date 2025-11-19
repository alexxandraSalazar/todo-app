import { authStore } from '@/stores/authStore';
import { authService } from '@/services/api/authService';
import { runInAction } from 'mobx';

jest.mock('@/services/api/authService');

describe('AuthStore Logic', () => {
    beforeEach(() => {
        runInAction(() => {
            authStore.logout();
        });
    });

    test('Estado inicial: No autenticado', () => {
        expect(authStore.isAuthenticated).toBe(false);
        expect(authStore.user).toBeNull();
    });

    test('Login Exitoso: Actualiza estado y localStorage', async () => {
        const mockUser = {
            id: '1', name: 'Test', email: 'test@test.com', token: 'jwt', createdAt: ''
        };

        (authService.login as jest.Mock).mockResolvedValue(mockUser);

        await authStore.login({ email: 'test@test.com', password: '123' });

        expect(authStore.isAuthenticated).toBe(true);
        expect(authStore.user?.email).toBe('test@test.com');
        expect(localStorage.setItem).toHaveBeenCalled();
    });

    test('Login Fallido: Maneja el error', async () => {
        (authService.login as jest.Mock).mockRejectedValue(new Error('Error Auth'));

        await authStore.login({ email: 'fail@test.com', password: '000' });

        expect(authStore.isAuthenticated).toBe(false);
        expect(authStore.error).toBe('Error Auth');
    });
});