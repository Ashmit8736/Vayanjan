import axiosInstance from "@services/api/axios-config";

export const getTokenStats = async (params = {}) => {
  return await axiosInstance.get("/tokens/stats", { params });
};
