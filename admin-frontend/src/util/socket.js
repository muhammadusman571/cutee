// src/socket.js
import { io } from "socket.io-client";
import { baseURL } from "./Config";

const SOCKET_URL = baseURL; // your backend URL

// initialize connection
const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export default socket;
