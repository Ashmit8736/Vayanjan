import axios from 'axios';

// Create axios instance with base configuration
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Add auth token to requests
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        // Handle errors globally
        if (error.response) {
            // Server responded with error
            const { status, data } = error.response;

            if (status === 401) {
                // Unauthorized - clear auth and redirect to login
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }

            return Promise.reject(data);
        } else if (error.request) {
            // Request made but no response (network error)
            return Promise.reject({
                message: 'Network error. Please check your connection.',
                offline: true,
            });
        } else {
            // Something else happened
            return Promise.reject({
                message: error.message || 'An error occurred',
            });
        }
    }
);

export default axiosInstance;
