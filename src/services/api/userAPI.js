import axiosInstance from './axios-config';

export const createBranchUserAPI = async (userData) => {
    try {
        const response = await axiosInstance.post('/users/branchUser', userData);
        return response;
    } catch (error) {
        throw error;
    }
};


export const registerUserAPI = async (userData) => {
    try {
        const response = await axiosInstance.post('/users/signup', userData);
        return response;
    } catch (error) {
        throw error;
    }
};

export const getBranchUsersAPI = async (branchId) => {
    try {
        const response = await axiosInstance.get(`/users/branch/${branchId}`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const getUsersAPI = async (params) => {
    try {
        const response = await axiosInstance.get('/users/list', { params });
        return response;
    } catch (error) {
        throw error;
    }
};
