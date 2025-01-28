import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useMatchStore = create((set) => ({
  matches: [],
  isLoadingMyMatches: false, //this for sidebar
  isLoadingUserProfiles: false, //this for loading userprofile (at center)
  userProfiles: [],
  swipeFeedback: null,

  // this function is used to get the matches of the user
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
  // this function is used to get the multiple user profiles
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

  swipeLeft: async (user) => {
    try {
      await axiosInstance.post("/matches/swipe-left/" + user._id);
      set({ swipeFeedback: "passed" });
    } catch (error) {
      console.log(error.message);
      toast.error(error.response?.data?.message || "Failed to swipe Left 😢");
    } finally {
      setTimeout(() => set({ swipeFeedback: null }), 1500);
    }
  },

  swipeRight: async (user) => {
    try {
      await axiosInstance.post("/matches/swipe-right/" + user._id);
      set({ swipeFeedback: "liked" });
    } catch (error) {
      console.log(error.message);
      toast.error(error.response?.data?.message || "Failed to swipe Right 😢");
    } finally {
      setTimeout(() => set({ swipeFeedback: null }), 1500);
    }
  },
}));
