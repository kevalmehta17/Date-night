import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useMatchStore = create((set) => ({
  matches: [],
  isLoadingMyMatches: false, //this for sidebar
  isLoadingUserProfiles: false, //this for loading userprofile (at center)
  userProfiles: [],

  getMyMatches: async () => {
    try {
      set({ isLoadingMyMatches: true });
      const res = await axiosInstance.get("/matches");
      set({ matches: res.data.matches });
    } catch (error) {
      set({ matches: [] });
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isLoadingMyMatches: false });
    }
  },
  getUserProfiles: async () => {
    try {
      set({ isLoadingUserProfiles: true });
      const res = await axiosInstance.get("/matches/user-Profiles");
      set({ userProfiles: res.data.users });
    } catch (error) {
      set({ userProfiles: [] });
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isLoadingUserProfiles: false });
    }
  },
}));
