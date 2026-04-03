import axios from "axios";

const API = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// logging...
API.interceptors.request.use((config) => {
  console.log(
    "Request:",
    config.method.toUpperCase(),
    config.baseURL + config.url
  );
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("Response error:", err.response?.status, err.message);
    return Promise.reject(err);
  }
);

export default API;
