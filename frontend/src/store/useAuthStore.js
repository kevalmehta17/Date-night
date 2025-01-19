import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null, // Default value for the authenticated user
  checkingAuth: true,
  loading: false,

  // Signup Method
  signup: async (signupData) => {
    try {
      console.log("Signup data:", signupData);
      set({ loading: true });

      // Make the API call
      const res = await axiosInstance.post("/auth/signup", signupData);

      // Set the authenticated user in the store
      set({ authUser: res.data.user });

      // Notify user of success
      toast.success("Signup successful");
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

  // Check Auth Method
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/me");
      console.log("Authenticated user:", res.data);
    } catch (error) {
      console.error("Error during authentication check:", error.message);
    }
  },
}));
