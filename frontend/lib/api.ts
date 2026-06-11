import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// attach token from localStorage (dev fallback) to Authorization header
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("token")
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
  } catch (e) {}
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    try {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem("token");
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    } catch (e) {}
    return Promise.reject(err);
  }
)