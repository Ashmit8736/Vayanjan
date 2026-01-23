import axiosInstance from './axios-config';

/**
 * Create a new branch
 * @param {Object} branchData - The branch data
 * @returns {Promise} - Response from server
 */
export const createBranchAPI = async (branchData) => {
    try {
        const response = await axiosInstance.post('/users/create', branchData);
        return response;
    } catch (error) {
        throw error;
    }
};

/**
 * Get all branches for the logged-in user
 * @returns {Promise} - List of branches
 */
export const getMyBranchesAPI = async () => {
    try {
        const response = await axiosInstance.get('/users/branches');
        return response;
    } catch (error) {
        throw error;
    }
};
