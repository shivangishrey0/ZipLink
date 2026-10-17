import axios from "axios";

// Not a secret: it is only the address of the backend (or of Nginx once it is in front of it).
export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

const axiosInstance = axios.create({
  baseURL: API_URL,
  // Sends the HTTP-only login cookie. The backend CORS setup allows this origin with credentials.
  withCredentials: true,
});

export default axiosInstance;
