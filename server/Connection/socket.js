import { Server } from "socket.io";
import { sessionMiddleware } from "../Middleware/index.js";
import { logger } from "../Utils/Logger/logger.js";

export const createSocketConnection = (server) => {
  const socketIO = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  socketIO.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
  });
  socketIO.on("connection", (socket) => {
    // need to be fixes
    // global.socket = socket;
    const { username } = socket.handshake.query;
    global.globalUsers[username] = socket.id;

    socket.onAny((event, ...args) => {
      console.log("Data from client : ");
      console.log(event, args);
    });
    logger.info(`⚡: ${socket.id} user just connected!`);
    socket.on("disconnect", () => {
      global.globalUsers[username] = null;
      logger.info(`🔥: ${socket.id} user just disconnected!`);
    });
  });
  return socketIO;
};
