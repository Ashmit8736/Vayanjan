import axiosInstance from "@services/api/axios-config";

// Areas APIs
export const getAreasList = async () => {
  return await axiosInstance.get("/dining/areas");
};

export const createArea = async (areaData) => {
  return await axiosInstance.post("/dining/areas/create", areaData);
};

export const updateArea = async (id, areaData) => {
  return await axiosInstance.put(`/dining/areas/update/${id}`, areaData);
};

export const deleteArea = async (id) => {
  return await axiosInstance.delete(`/dining/areas/delete/${id}`);
};

// Tables APIs
export const getTablesList = async () => {
  return await axiosInstance.get("/dining/tables");
};

export const createTable = async (tableData) => {
  return await axiosInstance.post("/dining/tables/create", tableData);
};

export const updateTable = async (id, tableData) => {
  return await axiosInstance.put(`/dining/tables/update/${id}`, tableData);
};

export const deleteTable = async (id) => {
  return await axiosInstance.delete(`/dining/tables/delete/${id}`);
};
