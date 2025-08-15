import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import avatar from "../../public/avatar.png";
const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5021" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      console.log("auth check", res.data);

      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // signup: async (data) => {
  //   set({ isSigningUp: true });
  //   try {
  //     const res = await axiosInstance.post("/auth/signup", data);
  //     set({ authUser: res.data });
  //     toast.success("Account created successfully");
  //     get().connectSocket();
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || "Signup failed");
  //     console.error(error.response?.data?.message);
  //   } finally {
  //     set({ isSigningUp: false });
  //   }
  // },

  signup: async (data) => {
    set({ isSigningUp: true });

    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("password", data.password);

      // If user selected an image
      if (data.profilePicFile) {
        formData.append("profilePic", URL.createObjectURL(avatar)); // must match backend field name
      }

      const res = await axiosInstance.post("/auth/signup", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error("Signup failed", error);
      console.error("Error while signup", error.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");

      get().connectSocket();
    } catch (error) {
      console.error(error.response?.data?.message);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
      console.error(error.response?.data?.message);
    }
  },

  // updateProfile: async (data) => {
  //   set({ isUpdatingProfile: true });
  //   try {
  //     const res = await axiosInstance.put("/auth/update-profile", data);
  //     set({ authUser: res.data });
  //     toast.success("Profile updated successfully");
  //   } catch (error) {
  //     console.log("error in update profile:", error);
  //     toast.error(error.response.data.message);
  //   } finally {
  //     set({ isUpdatingProfile: false });
  //   }
  // },

  updateProfile: async (formData) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.post("/auth/update-profile", formData, {
        // const res = await axiosInstance.post("/auth/update-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error in update profile:", error);
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
