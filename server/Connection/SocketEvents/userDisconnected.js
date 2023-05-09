import Users from "../../Models/Users.js";
import { logger } from "../../Utils/Logger/logger.js";
import { getUsersOnline } from "../../Utils/Socket/GlobalUsers.js";
import { SocketEvent } from "./eventTypes.js";

export const userDisconnected = async (socket) => {
  try {
    const { username } = socket.handshake.query;
    globalUsers[username] = null;
    if (!username)
      throw new Error("[Socket] Username should be in query handshake!");
    const disconnectedUser = await Users.findOne({ username });
    if (!disconnectedUser)
      throw new Error("[Socket] User not found in database !");
    disconnectedUser.lastVisit = new Date();
    await disconnectedUser.save();
    logger.info(
      `[Socket] ${username} with socket id : ${socket.id}  just disconnected!`
    );
    socket.broadcast.emit(SocketEvent.userDisconnected, getUsersOnline());
  } catch (e) {
    logger.error(`[Socket] ${e?.message}`);
  }
};
