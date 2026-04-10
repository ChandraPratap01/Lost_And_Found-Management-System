import axios from "axios";


const API=import.meta.env.VITE_Backend_ConnectionURL;
console.log(API);
const api = axios.create({
  baseURL: `${API}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;