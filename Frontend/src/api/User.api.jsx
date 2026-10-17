import axiosInstance, { API_URL } from "../utils/axiosInstance.js";

export const registerUser = async (body) => {
  const { data } = await axiosInstance.post("/api/auth/register", body);
  return data.user;
};

export const loginUser = async (body) => {
  const { data } = await axiosInstance.post("/api/auth/login", body);
  return data.user;
};

export const logoutUser = async () => {
  await axiosInstance.post("/api/auth/logout");
};

export const checkAuth = async () => {
  const { data } = await axiosInstance.get("/api/auth/check");
  return data.user;
};

// Google sign-in is a full page navigation to the backend, which then redirects to Google.
// The client secret stays on the backend, the browser never sees it.
export const googleLoginUrl = `${API_URL}/api/auth/google`;
