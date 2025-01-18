import axios from "axios";

//TODO: Add the base URL of the backend API so that it works in production
export const axiosInstance = axios.create({
  baseURL: "http://localhost:5500/api", //this is the base URL of the backend API
  withCredentials: true,
});
