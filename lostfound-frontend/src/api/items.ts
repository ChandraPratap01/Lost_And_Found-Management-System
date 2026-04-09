import api from "./axios";

export const getItemById = async (id: number | string) => {
  const response = await api.get(`/items/${id}`);
  return response.data;
};
