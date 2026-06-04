import axiosInstance from "@services/api/axios-config";

export const getItemsList = async (params = {}) => {
  return await axiosInstance.get("/item/list", { params });
};

export const createItem = async (itemData) => {
  return await axiosInstance.post("/item/create", itemData);
};

export const updateItem = async (id, itemData) => {
  return await axiosInstance.put(`/item/update/${id}`, itemData);
};
