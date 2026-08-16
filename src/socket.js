// src/socket.js
import { io } from "socket.io-client";

const Api_URL = import.meta.env.VITE_API_URL;

export const socket = io(Api_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 5000,
  auth: (cb) => {
    cb({ token: localStorage.getItem("authToken") });
  }
});