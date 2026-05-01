import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import app from "./app";

dotenv.config();

const port = process.env.PORT || 8181;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("joinRoom", (roomName: string) => {
    socket.join(roomName);
    console.log(`User joined room ${roomName}`);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/`);
});
