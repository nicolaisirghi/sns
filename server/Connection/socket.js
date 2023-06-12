import { Server } from "socket.io";
import { sessionMiddleware } from "../Middleware/index.js";
import { logger } from "../Utils/Logger/logger.js";
import { getUsersOnline } from "../Utils/Socket/GlobalUsers.js";
import Users from "../Models/Users.js";
import { getSocketEvent } from "./SocketEvents/index.js";
import { SocketEvent } from "./SocketEvents/eventTypes.js";
import { userDisconnected } from "./SocketEvents/userDisconnected.js";

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

  socketIO.on(SocketEvent.connection, (socket) => {
    const { username = "maimuta" } = socket.handshake.query;
    global.globalUsers[username] = socket.id;

    socket.broadcast.emit(SocketEvent.userConnected, getUsersOnline());
    socket.on(SocketEvent.disconnect, () => userDisconnected(socket));
    socket.onAny((event, ...args) => {
      logger.info(
        `[Socket] Event name : ${event}, args : ${JSON.stringify(args)}`
      );
      getSocketEvent(event, socket, args);
    });
    logger.info(
      `[Socket] ${username} with socket id :  ${socket.id}  just connected!`
    );
  });
  return socketIO;
};
