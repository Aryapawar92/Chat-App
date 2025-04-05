import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const users = {}; // userId => socketId

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // or wherever your frontend runs
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("A user connected:", userId);
  users[userId] = socket.id;

  socket.on("send-message", (data) => {
    const { senderId, receiverId, message } = data;
    const receiverSocketId = users[receiverId];

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receive-message", {
        senderId,
        receiverId,
        message,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", userId);
    delete users[userId];
  });
});

app.use(cors());
app.get("/", (req, res) => {
  res.send("Server is running");
});

server.listen(3001, () => {
  console.log("Server listening on port 3001");
});
