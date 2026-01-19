import axiosInstance from './axios-config';

/**
 * Register User API call (for Super Admin to create clients)
 * @param {Object} userData
 * @returns {Promise}
 */
export const registerUserAPI = async (userData) => {
    try {
        const response = await axiosInstance.post('/users/signup', userData);
        return response;
    } catch (error) {
        throw error;
    }
};

/**
 * Get all users API call with pagination
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Items per page (default: 6)
 * @returns {Promise}
 */
export const getUsersAPI = async (page = 1, limit = 6) => {
    try {
        const response = await axiosInstance.get('/users/list', {
            params: { page, limit }
        });
        return response;
    } catch (error) {
        throw error;
    }
};
