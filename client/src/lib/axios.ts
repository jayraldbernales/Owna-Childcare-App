import axios from "axios";
import { AuthStorage } from "../utils/authStorage";

const API = axios.create({
  baseURL: "http://localhost:8181",
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const auth = AuthStorage.get();
  if (auth?.token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      AuthStorage.clear();
    }
    return Promise.reject(error);
  }
);

export default API;
