// src/socket.js
import { io } from "socket.io-client";

const Api_URL = import.meta.env.VITE_API_URL;

export const socket = io(Api_URL, {
  autoConnect: true,
  auth: (cb) => {
    // Fetches the latest token every time a connection is attempted
    cb({ token: localStorage.getItem("authToken") });
  }
});