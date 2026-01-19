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
