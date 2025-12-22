import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

api.interceptors.request.use((config) => {
  console.log("AXIOS REQUEST:", config.method, config.url, config.data);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log("AXIOS RESPONSE:", response);
    return response;
  },
  (error) => {
    console.error("AXIOS ERROR:", error.response);
    return Promise.reject(error);
  }
);

export default api;
