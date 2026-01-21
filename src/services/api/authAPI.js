import axiosInstance from './axios-config';

/**
 * Login API call
 * @param {Object} credentials - { username, password }
 * @returns {Promise} - Response with user data and token
 */
export const loginAPI = async (credentials) => {
    try {
        const response = await axiosInstance.post('/auth/login', credentials);
        return response;
    } catch (error) {
        throw error;
    }
};

/**
 * Logout API call
 * @returns {Promise}
 */
export const logoutAPI = async () => {
    try {
        const response = await axiosInstance.post('/super-admin/logout');
        return response;
    } catch (error) {
        throw error;
    }
};


/**
 * Verify token
 * @returns {Promise}
 */
export const verifyTokenAPI = async () => {
    try {
        const response = await axiosInstance.get('/super-admin/verify');
        return response;
    } catch (error) {
        throw error;
    }
};

/**
 * Get User Branch Stats
 * @returns {Promise}
 */
export const getBranchStatsAPI = async () => {
    try {
        const response = await axiosInstance.get('/users/branch-stats');
        return response;
    } catch (error) {
        throw error;
    }
};
