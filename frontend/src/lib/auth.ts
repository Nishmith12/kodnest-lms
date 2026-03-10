import apiClient from './apiClient';
import { useAuthStore } from '../store/authStore';

export const authApi = {
    login: async (credentials: any) => {
        const { data } = await apiClient.post('/auth/login', credentials);
        useAuthStore.getState().setAuth(data.user, data.accessToken);
        return data;
    },

    register: async (credentials: any) => {
        const { data } = await apiClient.post('/auth/register', credentials);
        useAuthStore.getState().setAuth(data.user, data.accessToken);
        return data;
    },

    logout: async () => {
        try {
            await apiClient.post('/auth/logout');
        } catch (error) {
            console.error('Logout error', error);
        } finally {
            // Always clear local state even if server fails
            useAuthStore.getState().logout();
            window.location.href = '/auth/login';
        }
    }
};
