import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useUserStore = create((set) => ({
  loading: false,

  updateProfile: async (data) => {
    try {
      set({ loading: true });
      // Make the API call
      const res = await axiosInstance.put("/users/update", data);
      useAuthStore.getState().setAuthUser(res.data.user);
      toast.success("Profile updated successfully");
    } catch (error) {
      // Handle errors gracefully
      console.log("Update Profile error:", error.message);
      toast.error(
        error.response?.data?.message ||
          "Profile update failed. Please try again."
      );
    } finally {
      set({ loading: false });
    }
  },
}));
