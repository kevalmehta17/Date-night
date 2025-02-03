import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { disconnectSocket, initializeSocket } from "../socket/socket.client";

export const useAuthStore = create((set) => ({
  authUser: null, // Default value for the authenticated user
  checkingAuth: true, // Default value for checking authentication status
  loading: false,

  // Signup Method
  signup: async (signupData) => {
    try {
      set({ loading: true });
      // Make the API call
      const res = await axiosInstance.post("/auth/signup", signupData);
      // Set the authenticated user in the store
      set({ authUser: res.data.user });
      initializeSocket(res.data.user._id); //sending userId to client to server for socket connection
      toast.success("Account created successful", { duration: 3500 });
    } catch (error) {
      // Handle errors gracefully
      console.log("Signup error:", error.message);
      toast.error(
        error.response?.data?.message || "Signup failed. Please try again.",
        {
          duration: 3500,
        }
      );
    } finally {
      set({ loading: false });
    }
  },

  //logout Method

  logout: async () => {
    try {
      set({ loading: true });
      const res = await axiosInstance.post("/auth/logout");
      disconnectSocket(); // Disconnect the socket connection
      if (res.status === 200) {
        set({ authUser: null, checkingAuth: false });
      }
      toast.success("Logout successful");
    } catch (error) {
      console.error("Logout Error:", error.message);
      toast.error("Logout failed. Please try again.");
    } finally {
      set({ loading: false });
    }
  },

  //login Method

  login: async (loginData) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.post("/auth/login", loginData);
      set({ authUser: res.data.user });
      initializeSocket(res.data.user._id); //sending userId to client to server for socket connection
      toast.success("Logged in successfully", {
        duration: 2500,
      });
    } catch (error) {
      console.error("Login Error:", error.message);
      toast.error(
        error.response?.data?.message || "Login failed. Please try again.",
        {
          duration: 3500,
        }
      );
    } finally {
      set({ loading: false });
    }
  },

  // Check Auth Method
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/me");
      set({ authUser: res.data.user });
      initializeSocket(res.data.user._id); //sending userId to client to server for socket connection
      console.log("Authenticated user:", res.data);
    } catch (error) {
      set({ authUser: null });
      console.error("Error during authentication check:", error.message);
    } finally {
      set({ checkingAuth: false });
    }
  },
}));
