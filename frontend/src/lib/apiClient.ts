import axios from 'axios';
import { config } from './config';
import { useAuthStore } from '../store/authStore';

const apiClient = axios.create({
    baseURL: config.API_BASE_URL,
    withCredentials: true, // Important for refresh token cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to attach access token
apiClient.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().accessToken;
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle 401s and silent refresh
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If 401 and we haven't already tried to refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            // Don't intercept auth routes
            if (originalRequest.url.includes('/auth/login') || originalRequest.url.includes('/auth/register') || originalRequest.url.includes('/auth/refresh')) {
                return Promise.reject(error);
            }

            originalRequest._retry = true;

            try {
                // Attempt silent refresh
                const { data } = await axios.post(
                    `${config.API_BASE_URL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                const newAccessToken = data.accessToken;

                // Update Zustand store
                useAuthStore.getState().setAccessToken(newAccessToken);

                // Update authorization header for original request
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                // Retry original request
                return apiClient(originalRequest);
            } catch (refreshError) {
                // Refresh failed, user needs to login again
                useAuthStore.getState().logout();

                // Only redirect if we're not already on the auth page and we're in the browser
                if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth/')) {
                    window.location.href = '/auth/login';
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
