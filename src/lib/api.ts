import axios from "axios";

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  withCredentials: true,
});

// ✅ Interceptor: añade el token CSRF a todas las peticiones
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = getCookieValue("XSRF-TOKEN");
    if (token) {
      config.headers["X-XSRF-TOKEN"] = decodeURIComponent(token);
    }
  }
  return config;
});

function getCookieValue(name: string) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}
