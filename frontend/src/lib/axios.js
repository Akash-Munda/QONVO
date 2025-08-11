
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:5021/api" : "/api",
  withCredentials: true, // This allows cookies to be sent with requests
});
