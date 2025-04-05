import { io } from "socket.io-client";

export const initSocket = () => {
  const socket = io(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    {
      path: "/api/users/socket",
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    }
  );

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err);
  });

  return socket;
};
