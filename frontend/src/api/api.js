import axios from "axios";

console.log("API BASE:", import.meta.env.VITE_API_BASE_URL);

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + "/api",
});

// 🔐 Attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;
