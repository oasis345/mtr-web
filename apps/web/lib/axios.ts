import axios from "axios";

const CLIENT_API_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const SERVER_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ClientAPICall은 route.ts를 통해 서버와 통신
export const ClientAPICall = axios.create({
  baseURL: CLIENT_API_URL + "/api",
  withCredentials: true,
});

ClientAPICall.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/signin";
    }

    return Promise.reject(error);
  }
);

export const ServerAPICall = axios.create({
  baseURL: SERVER_API_URL,
  withCredentials: true,
});
