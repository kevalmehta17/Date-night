import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

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
      // Notify user of success
      toast.success("Account created successful");
    } catch (error) {
      // Handle errors gracefully
      console.log("Signup error:", error.message);
      toast.error(
        error.response?.data?.message || "Signup failed. Please try again."
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
      if (res.status === 200) {
        set({ authUser: null });
      }
      toast.success("Logout successful");
    } catch (error) {
      console.error("Logout Error:", error.message);
      toast.error("Logout failed. Please try again.");
    }
  },

  // Check Auth Method
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/me");
      set({ authUser: res.data.user });
      console.log("Authenticated user:", res.data);
    } catch (error) {
      set({ authUser: null });
      console.error("Error during authentication check:", error.message);
    } finally {
      set({ checkingAuth: false });
    }
  },
}));
