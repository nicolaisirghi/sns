import { Server } from "socket.io";
import { sessionMiddleware } from "../Middleware/index.js";
import { logger } from "../Utils/Logger/logger.js";
import { getUsersOnline } from "../Utils/Socket/GlobalUsers.js";
import Users from "../Models/Users.js";
import { getSocketEvent } from "./SocketEvents/index.js";

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

    socket.broadcast.emit("user connected", getUsersOnline());
    socket.onAny((event, ...args) => {
      logger.info(
        `[Socket] Event name : ${event}, args : ${JSON.stringify(args)}`
      );
      getSocketEvent(event, socket, args);
    });

    logger.info(
      `[Socket] ${username} with socket id :  ${socket.id}  just connected!`
    );
    socket.on("disconnect", async () => {
      try {
        global.globalUsers[username] = null;
        const disconnectedUser = await Users.findOne({ username });
        disconnectedUser.lastVisit = new Date();
        await disconnectedUser.save();
        logger.info(
          `Socket] ${username} with socket id : ${socket.id}  just disconnected!`
        );
        socket.broadcast.emit("user disconnected", getUsersOnline());
      } catch (e) {
        logger.error(`[Socket] ${e?.message}`);
      }
    });
  });
  return socketIO;
};
