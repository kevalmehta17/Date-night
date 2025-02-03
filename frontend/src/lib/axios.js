import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5500/api" : "/api";
export const axiosInstance = axios.create({
  baseURL: BASE_URL, //this is the base URL of the backend API
  withCredentials: true, //this is used to send the cookies along with the request
});
