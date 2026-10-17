import axiosInstance from "../utils/axiosInstance.js";

export const createShortUrl = async (body) => {
  const { data } = await axiosInstance.post("/api/create", body);
  return data;
};

export const getUserUrls = async ({ page = 1, limit = 10 } = {}) => {
  const { data } = await axiosInstance.get("/api/user/urls", { params: { page, limit } });
  return data;
};

export const updateUrl = async (id, body) => {
  const { data } = await axiosInstance.put(`/api/user/urls/${id}`, body);
  return data.url;
};

export const deleteUrl = async (id) => {
  await axiosInstance.delete(`/api/user/urls/${id}`);
};

export const unlockUrl = async (code, password) => {
  const { data } = await axiosInstance.post(`/api/protected/${code}/unlock`, { password });
  return data.url;
};

export const getAnalytics = async (code) => {
  const { data } = await axiosInstance.get(`/api/analytics/${code}`);
  return data;
};
