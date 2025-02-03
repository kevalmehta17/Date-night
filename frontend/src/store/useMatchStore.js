import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { getSocket } from "../socket/socket.client";

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
  // this function is used to get the multiple user profiles for the homePage due to useEffect calling
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
  //Connecting with the socket
  subscribeToNewMatch: () => {
    try {
      const socket = getSocket(); //get the socket instance
      socket.on("new-match", (newMatch) => {
        set((state) => ({ matches: [...state.matches, newMatch] }));
        toast.success("You got a new match!🥳");
      });
    } catch (error) {
      console.log(error.message);
      toast.error("Failed to subscribe to new matches");
    }
  },

  unsubscribeToNewMatch: () => {
    try {
      const socket = getSocket();
      socket.off("new-match");
    } catch (error) {
      console.log(error.message);
    }
  },
}));
