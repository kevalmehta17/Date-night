import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-toastify";
import { getSocket } from "../socket/socket.client.js";
import { useAuthStore } from "./useAuthStore.js";

export const useMessageStore = create((set) => ({
  messages: [],
  loading: true,

  sendMessage: async (receiverId, content) => {
    try {
      //this set Optimistic Update: add the message to the UI before sending it to the server
      set((state) => ({
        messages: [
          ...state.messages,
          { sender: useAuthStore.getState().authUser, content: content },
        ],
      }));
      const res = await axiosInstance.post(`message/send`, {
        receiverId,
        content,
      });
      console.log("Message sent", res.data);
    } catch (error) {
      console.error(error.message);
      toast.error(error.message || "Failed to send message");
    } finally {
      set({ loading: false });
    }
  },

  // This function is used to get the conversation between the logged in user and another user
  getMessages: async (userId) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.get(`/messages/conversation/${userId}`);
      set({ messages: res.data.messages });
    } catch (error) {
      console.error(error.message);
      set({ messages: [] });
    } finally {
      set({ loading: false });
    }
  },

  subscribeToMessages: () => {
    const socket = getSocket();
    socket.on("newMessage", ({ message }) => {
      set((state) => ({ messages: [...state.messages, message] })); //add new Msg
    });
  },

  unsubscribeFromMessages: () => {
    const socket = getSocket();
    socket.off("newMessage");
  },
}));
